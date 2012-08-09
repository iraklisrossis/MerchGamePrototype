/*
 * Interpreter.h
 *
 *  Created on: Aug 9, 2012
 *      Author: iraklis
 */

#ifndef INTERPRETER_H_
#define INTERPRETER_H_

#include "Renderer.h"

class Interpreter
{
public:
	Interpreter(){}

	void initialize(Renderer *renderer);

	void loadScript();

private:
	Renderer *mRenderer;
};


#endif /* INTERPRETER_H_ */
