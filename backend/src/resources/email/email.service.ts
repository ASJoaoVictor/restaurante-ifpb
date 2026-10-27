import { Injectable, Logger } from '@nestjs/common'
import { render } from '@react-email/render'
import { OAuth2Client } from 'google-auth-library'
import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { ComponentProps, FC, createElement } from 'react'
import { env } from '../../config/env.config'

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name)
  private readonly transporter: Promise<Transporter | null>

  constructor() {
    this.transporter = this.createTransporter()
  }

  async sendEmail(options: Mail.Options) {
    this.handleDevEmailProtection(options)
    const emailTransporter = await this.waitForTransporter()
    if (!emailTransporter) return

    options.from ??= {
      name: env.GMAIL_NAME,
      address: env.GMAIL_EMAIL
    }

    return emailTransporter.sendMail(options)
  }

  async sendEmailTemplate<T extends FC>(template: T, props: ComponentProps<T>, options: Mail.Options) {
    const html = await render(createElement(template, props))
    return this.sendEmail({ html, ...options })
  }

  private handleDevEmailProtection(options: Mail.Options) {
    if (env.NODE_ENV !== 'production' && !env.TEST_EMAIL) {
      throw new Error(
        `You are about to send an email to "${options.to as string}" in development mode!\n` +
          'Email sending has been blocked for security reasons.\n' +
          'You must define one or more test emails in the TEST_EMAIL environment variable to proceed.'
      )
    }

    if (env.TEST_EMAIL) {
      options.to = env.TEST_EMAIL
      options.cc = undefined
      options.bcc = undefined
    }
  }

  private async waitForTransporter(): Promise<Transporter | null> {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout waiting for transporter'))
      }, 10 * 1000)
    })

    const result = await Promise.race([this.transporter, timeoutPromise])
    return result as Transporter
  }

  private async createTransporter() {
    if (!this.checkEnv()) return null

    const accessToken = await this.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: env.GMAIL_EMAIL,
        accessToken,
        clientId: env.GMAIL_CLIENT_ID,
        clientSecret: env.GMAIL_CLIENT_SECRET,
        refreshToken: env.GMAIL_REFRESH_TOKEN
      }
    })

    return transporter
  }

  private async getAccessToken() {
    const clientId = env.GMAIL_CLIENT_ID
    const clientSecret = env.GMAIL_CLIENT_SECRET
    const redirectUri = 'https://developers.google.com/oauthplayground'
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)
    oauth2Client.setCredentials({ refresh_token: env.GMAIL_REFRESH_TOKEN })

    let retryTime = 500
    let accessToken: string | null = null

    while (!accessToken) {
      try {
        const res = await oauth2Client.getAccessToken()
        accessToken = res.token || null
        if (!accessToken) throw new Error('No access token received')
      } catch {
        this.logger.error('Error getting access token, retrying in ' + retryTime + 'ms')
        retryTime = Math.min(retryTime * 2, 5 * 60 * 1000)
        const currentRetryTime = retryTime
        await new Promise((resolve) => setTimeout(resolve, currentRetryTime))
      }
    }

    return accessToken
  }

  private checkEnv() {
    if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
      this.logger.warn('Some Gmail environment variables are not set')
      return false
    }

    if (env.TEST_EMAIL) {
      this.logger.warn(`All emails are being redirected to "${env.TEST_EMAIL}"`)
    }

    return true
  }
}
