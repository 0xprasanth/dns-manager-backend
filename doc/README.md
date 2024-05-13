# API ROUTES

### Test route
```
GET /api/test
```
### Base Route
```
/api/v1
```
- All routes follow this path


# Authentication Routes

## User login
```
POST /login
```
| Name | Description |
| ----------- | ----------- |
| email | String |
| password | String | 

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | successful operation |
| 400 | Invalid username/password supplied | 

---

## Create user

```
POST /signup
```
| Name | Description |
| ----------- | ----------- |
| username | String |
| email | String |
| password | String | 

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | successful operation |


# DNS Routes

## Base Route
```
/api/v1/domain/records
```
- All routes follow this path

### Get All Records
```
POST / 
```
### body
| Name | Description |
| ----------- | ----------- |
| hostedZoneId | ID of the HostedZone |

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | successful operation |
| 500 | Invalid operation or failed | 

---

### Create HostedZone 
```
POST /create-hosted-zone/:userId
```
### Parameters
| Name | Description |
| ----------- | ----------- |
| hostedZoneData |  An object contains name to create HostedZone |

### body
| Name | Description |
| ----------- | ----------- |
| hostedZoneData |  An object contains name to create HostedZone |

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | successful operation |
| 500 | Invalid operation or failed | 

---
### Create Record 
```
POST /create-record/
```

### body
| Name | Description |
| ----------- | ----------- |
| record |  Record object need to store and send to AWS format |
| hostedZoneData |  An object contains name to create HostedZone |

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | Record inserted Successfully |
| 400 |  Operation failed | 

---

### Update Record 

```
PUT /:recordId
```
### Parameters
| Name | Description |
| ----------- | ----------- |
| recordId | ID of the Record to update in DB |

### body
| Name | Description |
| ----------- | ----------- |
| record |  Record object need to update and send to AWS format |
| hostedZoneId |  ID of the HostedZone |

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | Record upserted Successfully |
| 500 |  Operation failed | 

---

### Delete Record 

```
DELETE /:recordId
```
### Parameters
| Name | Description |
| ----------- | ----------- |
| recordId | ID of the Record to update in DB |

### body
| Name | Description |
| ----------- | ----------- |
| record |  Record object need to update and send to AWS format |
| hostedZoneId |  ID of the HostedZone |

### Repsonses

| CODE | Description |
| ----------- | ----------- |
| 200 | Record deleted Successfully |
| 500 |  Operation failed | 

---