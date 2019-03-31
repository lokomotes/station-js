import { randomBytes } from 'crypto'
import fs from 'fs'
import { Token } from './api/router_pb'

function main(): Token {
    let id: string

    try {
        const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf-8')
            .split('\n')
            .find((v) => {
                return v.includes('docker')
            })

        if (cgroup === undefined) {
            throw new Error('not in docker container')
        }

        id = cgroup.split('docker/')[1]
    } catch (e) {
        id = ''
    }

    id = id || 'zz' + randomBytes(31).toString('hex')

    console.info(`token is ${id}`)

    const rst = new Token()
    rst.setId(id)

    return rst
}

export default main()
