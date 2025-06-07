
#  @rocket.chat/rest-typings

Package containing all Rocket.Chat rest endpoint definitions


## Contributing

Contributions are always welcome!
However we have some recommendations.
- Check if your implementation matches your definitions, a bad definition is worse than none.
- Use the generic types we created for paging.
- Create functions that assert properties (very useful for the backend)
- Do tests to ensure that your assertions are correct.
- Avoid incomplete and unknow typings

### Good examples of what not to do:

#### If you have an endpoint that accepts name or id, both are not optional, one of them is required

```typescript
    
    type EndPointTestGetParams = { name?: string; id?: string; } // WRONG!

    type EndPointTestGetParams = { name: string; } | { id: string; } // Better :)
````

#### If you have an endpoint that accepts name or id, both are not optional, one of them is required

```typescript
    export const isEndPointTestGetParams = (props: any) is EndPointTestGetParams => 'name' in prop || 'id' in prop; // WRONG!

    // .... Better
    
    
    import Ajv from 'ajv';

    const ajv = new Ajv();
    const endPointTestGetParams = {
        oneOf: [
            {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                },
                required: ['name'],
                additionalProperties: false,
            },
            {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                    },
                },
                required: ['id'],
                additionalProperties: false,
            },
        ],
    };

    export const isEndPointTestGetParams = ajv.compile<EndPointTestGetParams>(endPointTestGetParams);
```
## Optimizations

we use interfaces to register endpoints, so if you use a custom version, or miss an endpoint, you don't necessarily need to recompile the code, you can do it in your own code

```typescript
    declare module '@rocket.chat/rest-typings' {
        interface Endpoints {
            'custom/endpoint': {
                GET: (params: PaginatedRequest<{ query: string }>) => PaginatedResult<{
                    some: string[];
                }>;
            };
        }
    }
```

## Example: `users.sendWelcomeEmail`

The endpoint `/v1/users.sendWelcomeEmail` allows administrators to resend the welcome email to a user.

**Method:** `POST`

**Body parameters**

| Name  | Type   | Required | Description                        |
|-------|--------|----------|------------------------------------|
| email | string | Yes      | Email address of the target user. |

**Example request**

```bash
curl -X POST https://yourserver/api/v1/users.sendWelcomeEmail \
  -H "X-Auth-Token: <auth_token>" \
  -H "X-User-Id: <user_id>" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.doe@example.com"}'
```

**Successful response**

```json
{
  "success": true
}
```

## License

MIT

