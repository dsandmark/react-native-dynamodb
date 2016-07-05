import AwsSignature from 'react-native-aws-signature'
import _ from 'lodash'
import uuid from 'uuid'
import converter from './converter'

class DynamoDB {

    static init(...args) {
        // TODO: validate parameters required
        return new this(...args);
    }

    constructor(config) {
        this.credentials = config.credentials
        this.region = config.region || 'us-east-1'
        this.version = config.version || '20120810'
        this.options = {
            headers: {
                'Host': 'dynamodb.amazonaws.com',
                // 'User-Agent': '<UserAgentString>',
                'Content-Type': 'application/x-amz-json-1.0',
                'X-Amz-Target': `DynamoDB_${this.version}.`
            }
        }
    }

    _exec() {
        let signature = new AwsSignature(),
            body = JSON.stringify(this.body)

        this.options.headers['X-Amz-Date'] = signature.formatDateTime(new Date())
        signature.setParams({
            path: '/',
            method: 'post',
            service: 'dynamodb',
            headers: this.options.headers,
            region: this.region,
            credentials: this.credentials,
            body
        });

        // TODO: add header 'Content-Length': '<PayloadSizeBytes>',
        this.options.headers['Authorization'] = signature.getAuthorizationHeader().Authorization
        return fetch(`https://dynamodb.${this.region}.amazonaws.com`, {
            method: 'POST',
            headers: this.options.headers,
            body
        })
    }

    table(name) {
        this.body = {
            TableName: name
        }
        return this
    }

    // Creating Data
    putItem(data, ...args) {
        // appending auto generate key
        data.id = uuid.v4()

        // populate the Item - using mapValues to prevent M at start
        this.body.Item = _.mapValues(data , converter.input)

        // append request parameters
        this.body = Object.assign(this.body, ...args)

        this.options.headers['X-Amz-Target'] += 'PutItem'
        return this._exec()
    }

    BatchWriteItem() {}

    // Reading Data
    GetItem() {}
    BatchGetItem() {}
    Query() {}
    Scan() {}

    // Updating Data
    UpdateItem() {}

    // Deleting Data
    DeleteItem() {}
    BatchWriteItem() {}

    // DynamoDB Streams
    ListStreams() {}
    DescribeStream() {}
    GetShardIterator() {}
    GetRecords() {}
}

module.exports = DynamoDB