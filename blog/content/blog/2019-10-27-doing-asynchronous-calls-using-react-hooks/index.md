---
title: Doing asynchronous calls using React hooks
tags: ["programming", "react", "javascript"]
thumbnail: ./showuser-5.png
author: Lukas Steinbrecher
date: 2019-10-27
---
 
Doing asynchronous calls using React hooks is not straightforward.
One has to know how correctly write a functional component and also comply to the [Rules of hooks](https://reactjs.org/docs/hooks-rules.html).

In this post we discover various challenges doing asynchronous calls when using functional components.
We then build our own custom hooks, one which triggers the asynchronous calls when the component is mounted and one that triggers the call imperatively (e.g. when a button is clicked).

> With "asynchronous function" or "asynchronous call" we mean any javascript function, which triggers a side effect and returns a standard javascript `Promise`. At some point, the promise will either be resolved (on success) or be rejected (if an error occurs). If the promise is not yet resolved or rejected, it is in the loading state.

> In our examples we use the `fetch` function, but the asynchronous function could be any function which returns a promise.

## Naive approach

One could just trigger the asynchronous call directly in the render method:

`embed:1-naive.js`

In the example above we directly trigger the call inside the body of the render function.
Remember, when using a functional component, as we do, the function body itself is the render method (we directly return the components to be rendered).

One problem in this example is, that it is not allowed to do side effects directly inside the body of the render method. Quoting the React documentation:

> All React components must act like pure functions with respect to their props.

Additionally, a cleanup when the component unmounts is not happening. Imagine, the promise returned by the `doCall` function takes 10 seconds to resolve and in the meantime, the component is unmounted. The function `setResult` is still called, which could possibly lead to memory leaks.

When the promise is resolved and the component is already unmounted, we would get a warning like *"Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."*

One last problem is, that the call is executed every time the component is re-rendered, which could happen anytime.

So how can we do better?

## Using the effect hook

The right way to do side effects in a functional component is to use the `useEffect` hook.
We need to pass the (wrapped) asynchronous function as the first argument to the `useEffect` hook:

`embed:2-use-effect.js`

When using the `useEffect` hook we are doing side effects the correct way.

By default, the function passed to the `useEffect` hook is called for every rerender, which would cause our call to be executed for every props or state change, which we in our example certainly do not want.

To control this behaviour, we can pass a second argument to the `useEffect` hook, which is an array which defines the dependencies of the passed function.
When some value inside the dependency array changes, the effect is re-executed.

When passing an empty array, which effectively means, the effect has no dependencies, then the passed function is only executed once when the component is mounted.
This is the behaviour we want in our example.

`embed:3-use-effect-no-deps.js`

When the asynchronous call is dependent on some value and we want to re-trigger the call based on when some state changes or when property passed to the component changes, we explicitly need to add it to the dependencies array.

Imagine, we have a component which displays a user based on the passed user id, we need to pass the `userId` value as a dependency:

`embed:4-use-effect-with-deps.js`

When using the `useEffect` hook, we solved the issue with the prohibited side effects in the render method.
However when using calls with dependencies (e.g. like in the example above), we actually introduced a new problem:
When the effect is re-triggered and our asynchronous function is called again, we now have a race condition.

Imagine, the component is rendered as `<ShowUser userId={1} />`. When the component is mounted, the call to load user 1 is triggered as expected.
Now the component's `userId` property changes: `<ShowUser userId={2} />`. The component is then re-rendered with the changed property.
Subsequently also the effect is re-executed and the call to load user 2 is triggered.
Everything works as expected unless in some (possibly) rare cases, the first call takes longer to resolve than the second call. What would happen in this case, first the `setResult(<user 2>)` is called, and after the first call finally is resolved `setResult(<user 1>)`. This in turn would then certainly display the wrong user.

Remember, one additional challenge in the naive approach was, that there was no cleanup function, which could lead to problems, when the component is unmounted.

We can solve both problems using a cleanup function inside the effect.
In the function passed to the `useEffect` hook, we can return a callback function, which is executed when the effect is cleaned up. This cleanup happens each time the dependency array changes and at the very end, i.e. when the component is unmounted.

In our simple example, we just want to ignore the results after cleanup when the promise is resolved or rejected.

> If the API would support it, we could also, for example, cancel the fetch in the cleanup callback, effectively avoiding doing unnecessary work after the effect is cleaned up.

`embed:5-use-effect-cleanup.js`

As we see in the example above, the discussed race condition cannot happen anymore, because the cleanup function is called when the dependencies (in our case the `userId`) change, and the result is then ignored when the promise is resolved or rejected.

## Creating our own custom hook

Since we do have to take care for a lot of things to do for one asynchronous call, we can create our own custom hook, which abstracts the details of doing the calls the right way away.

A custom hook is a function which itself calls other hooks. Of course must also comply to the rules of hooks.

In our custom hook, the caller needs to have access to the loading and result states (`result`, `error`, `isLoading`) and of course we need to pass the asynchronous function to be triggered to the hook (including the dependencies of the call).
Everything else can be abstracted away.
Inside the hook we can just use the `useEffect` hook with the same ideas as in the examples above.

To pass the state and result variables we use the array deconstruction syntax, which is also used by the other built-in hooks, so we return everything the caller needs to know in one array.

`embed:6-use-promise.js`

In the example above, we define our own `usePromise` hook, which behaves like our example before.

> Note that we do not allow that the promise is passed directly (in contrast to pass a function which returns a promise), because this would imply doing the side effect outside of the `useEffect` hook.

Now to use our `usePromise` hook, we just need to pass our asynchronous function and the dependent values:

`embed:7-use-promise-usage.js`

As we see, the usage inside the component is now much more simpler, effectively only exposing the necessary states and creating a nice abstraction for doing asynchronous calls

## Manually triggering the asynchronous call

Often, we want to trigger calls imperatively based on some events.

In the following example we want to delete the user when a button is clicked.

`embed:8-manual-async-call.js`

In the example above, we could again start with the naive approach, doing the asynchronous call directly in the `deleteUser` function, but this would lead to the same cleanup problems as pointed out in the first section.

So we have to wrap the call in an effect again, however there is no way to imperatively trigger an effect, i.e. execute an effect using some sort of a callback function.

So what do we do in this case? We can actually do a little trick here. Remember, an effect re-executes every time one of the values in dependencies array changes.
We can leverage this behaviour here, by introducing a helper dependency value, which controls the execution of the effect. We then can control if we want to trigger the function call inside the effect:

`embed:9-manual-use-effect.js`

In this example, we introduced a helper state called `counter` which is passed as a dependency to the `useEffect` hook.

Inside the effect, we need to check whether the counter is greater than zero, since we do not want to trigger the call when the component is mounted and the effect is executed for the first time.
Furthermore for every button press, the counter is increased, and then, of course, is greater than zero, causing the effect to re-execute.
The reason we use a increasing counter here, and not just a boolean variable, is that for subsequent button presses we also want want the call to be triggered, so we have to make sure our helper dependency changes every time the trigger callback function is invoked.

> Note that the example is slightly wrong for keeping the code simple and for explaining the idea: When the `counter` variable is zero, we return `Promise.resolve()`, which causes the `usePromise` hook to return a wrong state to the caller.

Again, we can abstract the details away by creating a custom hook as a variant of the `usePromise` hook:

`embed:10-use-promise-on-callback.js`

We created a second custom hook `usePromiseOnCallback` which executes, when the callback trigger function is called.
We do not pass a dependencies array to the hook anymore, since we want to control the the execution of the function ourselves.

We can then use our `usePromiseOnCallback` hook like this:

`embed:11-use-promise-on-callback-usage.js`

## Conclusion

In this post we discovered how to do asynchronous calls using functional components and the newly introduced React hooks.

First, we looked into some challenges: It can lead to problems when doing side effects directly in the render method.
Then we looked into the `useEffect` hook, which is the correct way to do side effects in a functional component.
To manage the state of the returned promise we can use additional state variables. We have to unsubscribe when the effect is cleaned up otherwise a memory leak and race conditions can occur.
We introduced a custom hook `usePromise`, which abstracts the logic for doing asynchronous calls away.

In the second part of the article, we discovered a way to trigger asynchronous calls imperatively, i.e. by invoking a callback function, using a helper state variable in the `useEffect` hook.
We also abstracted the imperative triggering logic away using a custom `usePromiseOnCallback` hook.

We can summarize the use cases for our hooks:

| Hook                   | Use case                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `usePromise`           | Trigger an asynchronous call on component render, and/or when one the dependency values of the asynchronous function change |
| `usePromiseOnCallback` | Trigger an asynchronous call using a callback function, e.g. when a button is clicked or a different event happens         |
