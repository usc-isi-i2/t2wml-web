export default function readFile(file) {

  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reject(reader.error)
    }

    reader.onload = (file) => {
      const data = []
      const rows = file.target.result.split(/[\r\n|\n]+/)
      rows.forEach(row => data.push(row.split(',')))
      resolve(data)
    }

    reader.readAsBinaryString(file)
  })
}
