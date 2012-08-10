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

int func_newIsland(lua_State *L)
{
	maAlert("Test Func", "sdfdsf","ok", NULL, NULL);
}

void Interpreter::initialize(Renderer *renderer)
{
	L = lua_open();

	//luaopen_io(L);
	luaopen_base(L);
	luaopen_table(L);
	luaopen_string(L);
	luaopen_math(L);
	//luaopen_loadlib(L);

	lua_register(L, "newIsland", func_newIsland);

}

void Interpreter::loadScript(const char *script)
{
	luaL_loadstring(L, script);
	lua_call(L,0,LUA_MULTRET);
}

void Interpreter::newCoord(double lat, double lng)
{
	char buff[256];
	sprintf(buff,"got %f %f",lat,lng);
	maAlert("Test Func", buff,"ok", NULL, NULL);
}
