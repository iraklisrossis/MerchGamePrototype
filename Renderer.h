/*
 * Renderer.h
 *
 *  Created on: May 23, 2012
 *      Author: iraklis
 */

#ifndef RENDERER_H_
#define RENDERER_H_

#define MAX_ISLANDS 10

#include <NativeUI/widgets.h>
#include "maheaders.h"

using namespace NativeUI;

class Renderer
{
public:
	Renderer();

	void init();

	void draw(GLfloat z, GLfloat rotation);

	int loadImage(MAHandle imageHandle);

	void gluPerspective(
		GLfloat fovy,
		GLfloat aspect,
		GLfloat zNear,
		GLfloat zFar);

	void setViewport(int width, int height);

private:
	StackScreen *mStackScreen;
	Screen *mMapScreen;
	Screen *mTradeScreen;
	ImageButton *mIslandButtons[MAX_ISLANDS];
};


#endif /* RENDERER_H_ */
