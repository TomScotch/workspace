/**
 * @author wudm
 * @copyright 2016 Qcplay All Rights Reserved.
 */

// 桥接一下不同版本的 Box2D 库定义
Box2D.b2AABB = Box2D.Collision.b2AABB;
Box2D.b2Body = Box2D.Dynamics.b2Body;
Box2D.b2BodyDef = Box2D.Dynamics.b2BodyDef;
Box2D.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
Box2D.b2ContactListener = Box2D.Dynamics.b2ContactListener;
Box2D.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
Box2D.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
Box2D.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
Box2D.b2Vec2 = Box2D.Common.Math.b2Vec2;
Box2D.b2World = Box2D.Dynamics.b2World;
