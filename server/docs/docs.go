// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth/login": {
            "post": {
                "description": "用户登录并获取JWT令牌",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "认证"
                ],
                "summary": "用户登录",
                "parameters": [
                    {
                        "description": "登录信息",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.UserLoginRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "登录成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "400": {
                        "description": "请求参数错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "用户名或密码错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "500": {
                        "description": "服务器内部错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            }
        },
        "/auth/me": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "获取当前登录用户的详细信息",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "认证"
                ],
                "summary": "获取当前用户信息",
                "responses": {
                    "200": {
                        "description": "获取用户信息成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "未授权访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            }
        },
        "/auth/reset-password": {
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "用户重置自己的密码",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "认证"
                ],
                "summary": "重置密码",
                "parameters": [
                    {
                        "description": "密码重置信息",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.UserPasswordResetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "密码重置成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "400": {
                        "description": "请求参数错误或原密码错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "未授权访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "500": {
                        "description": "服务器内部错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            }
        },
        "/users": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "获取系统中所有用户的列表",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户管理"
                ],
                "summary": "获取所有用户",
                "responses": {
                    "200": {
                        "description": "获取用户列表成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "未授权访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "403": {
                        "description": "禁止访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "500": {
                        "description": "服务器内部错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "管理员创建新用户",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户管理"
                ],
                "summary": "创建新用户",
                "parameters": [
                    {
                        "description": "用户创建信息",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.UserCreateRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "用户创建成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "400": {
                        "description": "请求参数错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "未授权访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "403": {
                        "description": "禁止访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "409": {
                        "description": "用户名已存在",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "500": {
                        "description": "服务器内部错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            }
        },
        "/users/{id}": {
            "put": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "管理员更新指定用户的信息",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户管理"
                ],
                "summary": "更新用户信息",
                "parameters": [
                    {
                        "type": "string",
                        "description": "用户ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "用户更新信息",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/model.UserUpdateRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "用户更新成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "400": {
                        "description": "请求参数错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "未授权访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "403": {
                        "description": "禁止访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "404": {
                        "description": "用户不存在",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "500": {
                        "description": "服务器内部错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "管理员删除指定用户",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "用户管理"
                ],
                "summary": "删除用户",
                "parameters": [
                    {
                        "type": "string",
                        "description": "用户ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "用户删除成功",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "401": {
                        "description": "未授权访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "403": {
                        "description": "禁止访问",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "404": {
                        "description": "用户不存在",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    },
                    "500": {
                        "description": "服务器内部错误",
                        "schema": {
                            "$ref": "#/definitions/controller.SwaggerResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "controller.SwaggerResponse": {
            "description": "API响应的标准格式",
            "type": "object",
            "properties": {
                "code": {
                    "description": "HTTP状态码",
                    "type": "integer",
                    "example": 200
                },
                "data": {
                    "description": "响应数据"
                },
                "error": {
                    "description": "错误信息(当success=false时)",
                    "type": "string",
                    "example": "参数错误"
                },
                "message": {
                    "description": "响应消息",
                    "type": "string",
                    "example": "操作成功"
                },
                "requestId": {
                    "description": "请求ID，用于跟踪",
                    "type": "string",
                    "example": "550e8400-e29b-41d4-a716-446655440000"
                },
                "success": {
                    "description": "是否成功",
                    "type": "boolean",
                    "example": true
                },
                "timestamp": {
                    "description": "响应时间戳",
                    "type": "string",
                    "example": "2023-01-01T12:00:00Z"
                }
            }
        },
        "model.UserCreateRequest": {
            "type": "object",
            "required": [
                "password",
                "role",
                "username"
            ],
            "properties": {
                "password": {
                    "type": "string",
                    "minLength": 6
                },
                "role": {
                    "type": "string",
                    "enum": [
                        "admin",
                        "user"
                    ]
                },
                "username": {
                    "type": "string",
                    "maxLength": 20,
                    "minLength": 3
                }
            }
        },
        "model.UserLoginRequest": {
            "type": "object",
            "required": [
                "password",
                "username"
            ],
            "properties": {
                "password": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "model.UserPasswordResetRequest": {
            "type": "object",
            "required": [
                "newPassword",
                "oldPassword"
            ],
            "properties": {
                "newPassword": {
                    "type": "string",
                    "minLength": 6
                },
                "oldPassword": {
                    "type": "string"
                }
            }
        },
        "model.UserUpdateRequest": {
            "type": "object",
            "properties": {
                "needReset": {
                    "type": "boolean"
                },
                "password": {
                    "type": "string",
                    "minLength": 6
                },
                "role": {
                    "type": "string",
                    "enum": [
                        "admin",
                        "auditor",
                        "configurator",
                        "user"
                    ]
                },
                "username": {
                    "type": "string",
                    "maxLength": 20,
                    "minLength": 3
                }
            }
        }
    },
    "securityDefinitions": {
        "BearerAuth": {
            "description": "使用 Bearer {token} 格式进行身份验证",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:2333",
	BasePath:         "/api/v1",
	Schemes:          []string{},
	Title:            "Simple-WAF API",
	Description:      "简单的 Web 应用防火墙管理系统 API",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
