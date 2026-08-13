import COS from 'cos-js-sdk-v5'

// 创建 COS 实例
// 注意：写死 SecretId/SecretKey 仅适合学习/演示场景。
// 生产环境务必改为通过后端接口下发临时密钥（STS）来初始化，避免前端泄露永久密钥。
const cos = new COS({
  SecretId: 'AKIDbzGOMIHB0GpQXaUEl6FEJH7oJbifQzMd', // TODO: 填入你的腾讯云 SecretId
  SecretKey: 'B9tX3O0Vs6B7210rbL7pOlv1wqcGKCxX' // TODO: 填入你的腾讯云 SecretKey
})
// SecretId:AKIDbzGOMIHB0GpQXaUEl6FEJH7oJbifQzMd
// SecretKey:B9tX3O0Vs6B7210rbL7pOlv1wqcGKCxX
/**
 * 前端直传：把文件/Blob 上传到腾讯云 COS
 * @param {File|Blob} file 需要上传的文件对象
 * @param {Function} [onProgress] 上传进度回调，参数 progressData.percent 为 0~1
 * @returns {Promise<string>} 上传成功后 resolve 图片的完整访问地址（data.Location）
 */
export const putObject = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        // 填入你自己创建的存储桶，必须字段
        Bucket: 'imooc-front-1466444686',
        // 存储桶所在地域，例如 ap-beijing，必须字段
        Region: 'ap-guangzhou',
        // 存储在桶里的对象键（例如 avatar/xxx.png）
        Key: `avatar/${Date.now()}_${file.name}`,
        // 注意：该桶为多可用区（MAZ）桶，存储类型必须用 MAZ_STANDARD，
        // 传 STANDARD 会被 COS 拒绝并报 SAZOperationNotSupportOnMAZBucket
        StorageClass: 'MAZ_STANDARD',
        Body: file, // 上传文件对象
        onProgress(progressData) {
          onProgress && onProgress(progressData)
        }
      },
      (err, data) => {
        if (err) {
          reject(err)
          return
        }
        // 上传成功，data.Location 为图片的地址
        // 注意：COS 返回的 Location 通常不带协议前缀（如 bucket.cos.region.myqcloud.com/key），
        // 必须补全为 https:// 绝对地址，否则 img src 会被当成相对路径导致 404 不显示
        const location = data.Location
        resolve(/^https?:\/\//.test(location) ? location : `https://${location}`)
      }
    )
  })
}
