import base64 from 'base-64'
import utf8 from 'utf8'
import fs from 'fs'

export default {
  methods: {
    /**
     * Save as json file
     *
     * @param {*} filename
     * @param {*} data
     * @returns
     */
    saveToLocalStorage (filename, data) {
      try {
        const text = JSON.stringify(data)
        const bytes = utf8.encode(text)
        const encoded = base64.encode(bytes)

        fs.writeFileSync(`${filename}.json`, encoded)
      } catch (error) {
        console.log(error)

        return null
      }
    },
    /**
     * Retrieve local storage from json file
     *
     * @param {*} filename
     * @returns
     */
    async getLocalStorage (filename) {
      try {
        const data = await fs.readFileSync(`${filename}.json`, 'utf8')

        return JSON.parse(base64.decode(data))
      } catch (error) {
        console.log(error)

        return null
      }
    },
    /**
     * Set unique IDs to newly added records
     *
     * @param {*} oldData
     * @param {*} newData
     * @returns
     */
    setUniqueIds (oldData, newData) {
      let newRecords = newData.slice()
      const oldRecords = oldData.slice()

      newRecords = newRecords.map((val, i) => {
        if (!val.id) {
          val.id = (oldRecords.length && oldRecords[oldRecords.length - 1].id) ? oldRecords[oldRecords.length - 1].id + 1 : i + 1

          oldRecords.push(val)
        }

        return val
      })

      return newRecords
    },
    /**
     * Set unique names to newly added records
     *
     * @param {*} name
     * @param {*} newData
     * @returns
     */
    setUniqueNames (name, newData) {
      let data = newData.slice()

      data = data.map((val) => {
        if (val.id) val.name = `${name}${val.id}`

        return val
      })

      return data
    }
  }
}
