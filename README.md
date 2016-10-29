# redux-nylas-middleware

Redux Nylas middleware makes it super easy to make Nylas API calls in redux action creators. No need to pass around an access token to make requests.

### Setup

```
npm install redux-nylas-middleware --save
```

The middleware provides two actions to help manage your token (`setToken` and `clearToken`).  Import the actions into whatever container you will be using them in and put them in mapDispatchToProps.
```
import { actions as nylasActions } from 'redux-nylas-middleware'

...

const mapDispatchToProps = (dispatch) => {
  return {
    ...nylasActions,
  }
}

```

After doing the oauth dance with Nylas, call the `setToken` action you just put in your container and pass the token:
```
componentDidMount() {
  this.props.setToken('a1b2c3d4e5f6g7h8i9')
}
```

### Making Calls in Actions

Making calls in actions are now super easy. Import `NYLAS_API` and set that as the key of the returned object:

```
import { NYLAS_API } from 'redux-nylas-middleware'

getThreads: () => ({
  [NYLAS_API]: {
    endpoint: 'threads?in=inbox',
    types: [THREADS_REQUEST, THREADS_SUCCESS, THREADS_FAILURE],
  },
})

```
This will then dispatch the `THREADS_REQUEST` action whenever it is making a request and then either a `THREADS_SUCCESS` if it is successful or `THREADS_FAILURE` if it is not.

### Api Object

* **endpoint**: String. Endpoint after `https://api.nylas.com/`. Eg: `threads`
* **endpoints**: Array of Strings. If you want to make multiple requests in one action, pass in an array of endpoints here. It is useful when fetching, for example, multiple messages: `['messages/1', 'messages/2', 'messages/3', 'messages/4']`
* **types**: Array of action types. Required. In order: `[REQUEST_ACTION_TYPE, SUCCESS_ACTION_TYPE, FAILURE_ACTION_TYPE]`
* **method**: String. Fetch method: `GET`, `PUT`, `POST`, `DELETE`, defaults to `GET`.
* **body**: Object. Any data you are passing to Nylas. It is stringified automatically.
