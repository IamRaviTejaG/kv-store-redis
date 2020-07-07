import axios from 'axios'


export default {
  /**
   * Sends pushover alerts.
   * @param  status
   * @param  message
   */
  pushover: (status, message) => {
    axios.post(process.env.PUSHOVER_API_URL, null, { params: {
      'token': process.env.PUSHOVER_TOKEN,
      'user': process.env.PUSHOVER_USER_KEY,
      'title': `${process.env.MACHINE_NAME} - ${process.env.APP_NAME} - [APP_STATE]: ${status}`,
      'message': `${process.env.EC2_MACHINE_DNS_URL}: ${process.env.APP_NAME}: ${message}`
    }})
  }
}
