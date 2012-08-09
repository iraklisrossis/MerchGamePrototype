/*
 * Interpreter.cpp
 *
 *  Created on: Aug 9, 2012
 *      Author: iraklis
 */

#include "Interpreter.h"
extern "C"
{
#include "lua.h"
#include "lualib.h"
#include "lauxlib.h"
}

void Interpreter::initialize(Renderer *renderer)
{
	lua_State *L = lua_open();

	luaopen_io(L);
	luaopen_base(L);
	luaopen_table(L);
	luaopen_string(L);
	luaopen_math(L);
	luaopen_loadlib(L);


}
