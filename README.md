# Pair of employees who have worked together

Create an application that identifies the pair of employees who have worked
together on common projects for the longest period of time.
Input data:
A CSV file with data in the following format:
EmpID, ProjectID, DateFrom, DateTo

Sample data:

```js
143, 12, 2013-11-01, 2014-01-05
218, 10, 2012-05-16, NULL
143, 10, 2009-01-01, 2011-04-27
...
```

Sample output:

```js
143, 218, 8;
```
