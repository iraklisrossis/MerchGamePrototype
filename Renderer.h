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

	void initialize();

	int loadImage(MAHandle imageHandle);

	void getMapSize(int *width, int *height);

	void clearIslands();

	void addIsland(int x, int y);


private:
	StackScreen *mStackScreen;
	Screen *mMapScreen;
	Screen *mTradeScreen;
	ImageButton *mIslandButtons[MAX_ISLANDS];
};


#endif /* RENDERER_H_ */
