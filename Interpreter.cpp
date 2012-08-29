/*
 * Interpreter.cpp
 *
 *  Created on: Aug 9, 2012
 *      Author: iraklis
 */

#include <mavsprintf.h>
#include "Interpreter.h"
extern "C"
{
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
}

Interpreter *interpreter;

int func_newIsland(lua_State *L)
{
	int x = (int)lua_tonumber(L, 1);
	int y = (int)lua_tonumber(L, 2);
	/*char buff[256];
	sprintf(buff,"got %f %f",lat,lng);
	maAlert("Test Func", buff,"ok", NULL, NULL);*/
	interpreter->mRenderer->addIsland(x,y);
	return 0;
}

int func_clearIslands(lua_State *L)
{
	interpreter->mRenderer->clearIslands();
	return 0;
}

void Interpreter::initialize(Renderer *renderer)
{
	interpreter = this;
	mRenderer = renderer;
	L = lua_open();
	printf("opening lua");
	//luaopen_io(L);
	luaopen_base(L);
	luaopen_table(L);
	luaopen_string(L);
	luaopen_math(L);
	//luaopen_loadlib(L);
	printf("registering newIsland");
	lua_register(L, "newIsland", func_newIsland);
	lua_register(L, "clearIslands", func_clearIslands);
}

void Interpreter::loadScript(const char *script)
{
	printf("loading script");
	luaL_loadstring(L, script);
	printf("executing script");
	lua_pcall(L,0,LUA_MULTRET,0);


}

void Interpreter::newCoord(double lat, double lng)
{
	printf("pushing");
	lua_pushstring(L,"newCoords");
	lua_gettable(L, LUA_GLOBALSINDEX);
	lua_pushnumber(L, lat);
	lua_pushnumber(L, lng);
	printf("calling newCoords");
	lua_pcall(L, 2, 0,0);
}

void Interpreter::setMapSize(int width, int height)
{
	lua_pushnumber(L,width);
	lua_setfield(L, LUA_GLOBALSINDEX, "mapWidth");

	lua_pushnumber(L,height);
	lua_setfield(L, LUA_GLOBALSINDEX, "mapHeight");
}
