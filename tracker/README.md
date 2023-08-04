## [Issue Tracker](https://quality-assurance-app.onrender.com/issue-tracker)
The idea behind this project was to create a tool to track issues on a project.

###### Create
**Creating a project** requires only a name.  
To create an issue, the model needs 6 pieces of information, some of which are required:
- Project name *required*
- Issue title *required*
- Issue text *required*
- Created by *required*
- Assigned to *optional*
- Status text *optional*
All this info must be sent as a body in a POST request to `/issue-tracker/api/v1/issues/{project name}`.  
In this case, the answer will be an object with 10 key-value pairs:
```
{
	"_id": "Issue id String",
	"project": "Project id String",
	"issue_title": "Issue title String",
	"issue_text": "Issue text String",
	"created_on": "Date String",
	"updated_on": "Date String",
	"created_by": "String",
	"assigned_to": "String",
	"open": true,
	"status_text": "String"
}
```

**Note:**
- The body keys must be all in small letters and the spaces must be replaced by `_` - *e.g.*: `project_name`, `issue_title`, `issue_text`, `created_by`.
- The project name is unique.

###### Read
**To retrieve all projects**, you must send a GET request to `/issue-tracker/api/v1/projects`.  
The answer will be an Array with all projects, and each project will have 3 key-value pairs:
```
[
    {
        "_id": "Project _id String",
        "name": "Project name String",
        "issues": [Issues id Strings]
    }
]
```

**To search project issues**, you need its name and send a GET request to `/issue-tracker/api/v1/issues/{project name}`.  
In this case, the answer will be an object with 3 key-value pairs:
```
{
    "_id": "Project _id String"
    "name": "Project name String"
    "issues": [Issues Objects]
}
```

**To make the search more precise**, you can use filters as queries. The options to send as filters are:
- Issue id
- Issue title
- Assigned to
- Created by
- Open

**Note:**
- The query keys must be all in small letters, and the spaces must be replaced by `_` - *e.g.*: `issue_id`, `issue_title`, `created_by`.

###### Update
**To update a project issue**, you must send a PUT request to `/issue-tracker/api/v1/issues/{project name}`.  
The request must have a body with the project name, issue id, and the fields to update.  
In this case, the answer will be an object with 2 key-value pairs:
```
{
	"result": "successfully updated",
	"_id": "Issue id String"
}
```

###### Delete
**To delete a project issue**, you must send a DELETE request to `/issue-tracker/api/v1/issues/{project name}`.  
The request must have a body with the issue id.  
In this case, the answer will be an object with 2 key-value pairs:
```
{
	"result": "successfully deleted",
	"_id": "Issue id String"
}
```

**To delete a project**, you must send a DELETE request to `/issue-tracker/api/v1/projects/{project name}`.  
In this case, the answer will be an object with 2 key-value pairs:
```
{
	"result": "successfully deleted",
	"name": "Project name String"
}
```

**Note:**
- When a project is deleted, all of its issues are deleted as well.
