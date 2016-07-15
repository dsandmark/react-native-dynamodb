import AwsSignature from 'react-native-aws-signature'
import _ from 'lodash'
import uuid from 'uuid'
import Converter from './converter'

class DynamoDB {

    static init(...args) {
        // TODO: validate parameters required
        return new this(...args);
    }

    constructor(config) {
        this.credentials = config.credentials
        this.region = config.region || 'us-east-1'
        this.version = config.version || '20120810'
        this.headers = {
            'Host': 'dynamodb.amazonaws.com',
            // 'User-Agent': '<UserAgentString>',
            'Content-Type': 'application/x-amz-json-1.0; charset=utf-8'
        }
    }

    _exec() {
        let signature = new AwsSignature(),
            body = JSON.stringify(this.body)

        this.headers['X-Amz-Date'] = signature.formatDateTime(new Date())
        signature.setParams({
            path: '/',
            method: 'post',
            service: 'dynamodb',
            headers: this.headers,
            region: this.region,
            credentials: this.credentials,
            body
        });

        // TODO: add header 'Content-Length': '<PayloadSizeBytes>',
        this.headers['X-Amz-Target'] = `DynamoDB_${this.version}.${this.headers['X-Amz-Target']}`
        this.headers['Authorization'] = signature.getAuthorizationHeader().Authorization

        return fetch(`https://dynamodb.${this.region}.amazonaws.com`, {
            method: 'POST',
            headers: this.headers,
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
    PutItem(data, ...args) {
        // appending auto generate key
        data.id = uuid.v4()

        // populate the Item - using mapValues to prevent M at start
        this.body.Item = _.mapValues(data , Converter.input)

        // append request parameters
        this.body = Object.assign(this.body, ...args)

        this.headers['X-Amz-Target'] = 'PutItem'
        return this._exec()
    }

    BatchWriteItem() {}

    // Reading Data
    GetItem(key, ...args) {
        // populate the Key
        this.body.Key = _.mapValues(key , Converter.input)

        // append request parameters
        this.body = Object.assign(this.body, ...args)

        this.headers['X-Amz-Target'] = 'GetItem'
        return this._exec()
    }
    BatchGetItem() {}
    Query() {}
    Scan() {}

    // Updating Data
    UpdateItem(key, ...args) {
        // populate the Key
        this.body.Key = _.mapValues(key , Converter.input)

        // append request parameters
        this.body = Object.assign(this.body, ...args)

        this.headers['X-Amz-Target'] = 'UpdateItem'
        return this._exec()
    }

    // Deleting Data
    DeleteItem() {
        // populate the Key
        this.body.Key = _.mapValues(key , Converter.input)

        // append request parameters
        this.body = Object.assign(this.body, ...args)

        this.headers['X-Amz-Target'] = 'DeleteItem'
        return this._exec()
    }
    BatchWriteItem() {}

    // DynamoDB Streams
    ListStreams() {}
    DescribeStream() {}
    GetShardIterator() {}
    GetRecords() {}
}

export { DynamoDB, Converter }