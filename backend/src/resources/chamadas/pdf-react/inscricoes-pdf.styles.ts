import { StyleSheet } from '@react-pdf/renderer'

export const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    color: '#202124',
    fontFamily: 'Open Sans',
    height: 841.89,
    paddingBottom: 25,
    paddingHorizontal: 25,
    paddingTop: 25,
    width: 595.28
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 4
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  brandLogo: {
    height: 42,
    objectFit: 'contain',
    objectPosition: 'left center',
    width: 178
  },
  callInfo: {
    alignItems: 'flex-end',
    maxWidth: 168
  },
  callName: {
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'right'
  },
  callDate: {
    color: '#64666d',
    fontSize: 9,
    marginTop: 3,
    textAlign: 'right'
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 37,
    marginTop: 32,
    textAlign: 'center'
  },
  table: {
    width: '100%'
  },
  tableRow: {
    flexDirection: 'row',
    height: 18
  },
  tableHeader: {
    backgroundColor: '#eceff1',
    height: 24
  },
  cell: {
    borderBottomColor: '#c9ced3',
    borderBottomWidth: 0.7,
    borderLeftColor: '#c9ced3',
    borderLeftWidth: 0.7,
    justifyContent: 'center'
  },
  lastCell: {
    borderRightColor: '#c9ced3',
    borderRightWidth: 0.7
  },
  headerCell: {
    borderTopColor: '#c9ced3',
    borderTopWidth: 0.7,
    fontSize: 9.5,
    fontWeight: 700,
    lineHeight: 1.2,
    paddingTop: 6,
    textAlign: 'center'
  },
  ordinalCell: {
    width: 42
  },
  ordinal: {
    fontSize: 9,
    lineHeight: 1,
    textAlign: 'center',
    width: '100%'
  },
  nameCell: {
    flex: 1,
    paddingHorizontal: 5
  },
  nameContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  name: {
    fontSize: 9.5,
    lineHeight: 1,
    maxWidth: 280
  },
  badges: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginLeft: 5
  },
  badge: {
    borderColor: '#9299a1',
    borderRadius: 2,
    borderWidth: 0.6,
    color: '#64666d',
    fontSize: 5.8,
    paddingHorizontal: 3.5,
    paddingVertical: 1.5
  },
  markCell: {
    width: 28
  },
  footer: {
    bottom: 39,
    left: 29,
    position: 'absolute',
    right: 25
  },
  legend: {
    color: '#64666d',
    fontSize: 6.5,
    marginBottom: 7
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  progress: {
    backgroundColor: '#eceff1',
    borderRadius: 1.25,
    height: 2.5,
    overflow: 'hidden',
    width: 190
  },
  progressValue: {
    backgroundColor: '#202124',
    borderRadius: 1.25,
    height: 2.5
  },
  occupancy: {
    fontSize: 6.5,
    marginLeft: 8
  },
  pageNumber: {
    fontSize: 6.5,
    marginLeft: 'auto',
    textAlign: 'right'
  }
})
