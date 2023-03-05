# Task 2: Optimize on async functions

## Description

Rewrite the - ```getAllImpressions``` method to get better performance and explain the mechanics behind the solution.
Approach the task as you would approach real life project, code base changes and refactors are allowed. But do not change the ```timeout``` variable ;)  

## start

```node index.js```

## Solution

- Preffered usage of async await for readability, as long as task have to be executed sequentially
- Promise.all for parallel execution
- Meaningul logs in production (Logs slow down execution time by ~20s here)

### Comment

- If we knew that all ads and all impressions will be needed, also running these requests in parallel would be possible
- I assumed that in a real situation we *need* to wait for the ads, to be able to refer to the impression
Thank you for reviewing!
