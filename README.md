# React Native DynamoDB

This library helps you access to [DynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) from React Native, using [Low-Level API](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html). We use [leimd/react-native-aws-signature](https://github.com/leimd/react-native-aws-signature) for generate signatures for aws request


## Installation
```bash
npm install react-native-dynamodb --save
```

## Usage
```javascript
import DynamoDB from 'react-native-dynamodb'

let dynamodb = DynamoDB.init({
    credentials: {
        AccessKeyId: '<AWS_ACCESS_KEY>',
        SecretKey: '<AWS_SECRET_KEY>'
    }
    // region: 'us-east-1' - default, optional
    // version: '20120810' - default, optional
})

dynamodb.table('pirates').putItem(
{
    name: 'Jack Sparrow',
    age: 30,
    captain: true
},
{
    ConditionExpression: "last_movie <> :movie",
    ExpressionAttributeValues: {
        ":movie": {"S": "Pirates of the Caribbean: On Stranger Tides"}
    }
})
.then((response) => console.log(response)) // AWS object response
.catch((error) => {
    console.log(error)
})
```

## Todo
Work in progress...
[API operations supported:](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations.html)
* [x] [PutItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html)

## License
This software is licensed under the MIT License.
React and React Native are BSD licensed. Facebook also provide an additional patent grant.