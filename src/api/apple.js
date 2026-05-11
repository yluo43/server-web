import http from '@/utils/httpRequest'

/**
 * 验证Apple收据 (EggNote专用)
 * @param {Object} data - 收据数据
 * @param {string} data.receiptData - Apple收据数据(base64编码)
 * @param {string} [data.transactionId] - 交易ID(可选)
 */
export function verifyAppleReceipt(data) {
  return http({
    url: http.adornUrl('/user/apple/verify-receipt', true),
    method: 'post',
    data: data
  })
}
