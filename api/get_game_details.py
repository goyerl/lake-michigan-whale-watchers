import os
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

table_name = os.environ.get('TABLE_NAME', 'lmww-schedule')

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)


def handler(event, context=None):
    date = event['pathParameters']['date']
    response = table.query(
        KeyConditionExpression=Key('season').eq(os.environ.get('SEASON', 'Fall 2023'))
        & Key('date').eq(date))
    return {
        'isBase64Encoded': False,
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'body': json.dumps(response['Items']),
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


if __name__ == '__main__':
    print(handler(event={'pathParameters': {'date': '05-30-23'}}))