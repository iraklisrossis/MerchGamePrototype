/*
 * Interpreter.h
 *
 *  Created on: Aug 9, 2012
 *      Author: iraklis
 */

#ifndef INTERPRETER_H_
#define INTERPRETER_H_

#include "Renderer.h"

class lua_State;

class Interpreter
{
public:
	Interpreter(){}

	void initialize(Renderer *renderer);

	void setMapSize(int width, int height);

	void loadScript(const char *script);

	void newCoord(double lat, double lng);

	Renderer *mRenderer;
private:


	lua_State *L;
};


#endif /* INTERPRETER_H_ */
