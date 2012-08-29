/*
 * Renderer.cpp
 *
 *  Created on: May 23, 2012
 *      Author: iraklis
 */

#include "Renderer.h"

Renderer::Renderer()
{
}

/**
 * Called when a fullscreen window with an OpenGL context
 * has been created and is ready to be used.
 */
void Renderer::initialize()
{
	mStackScreen = new StackScreen();
	mMapScreen = new Screen();
	mMapScreen->setTitle("Map");
	mTradeScreen = new Screen();
	mTradeScreen->setTitle("Trade");

	RelativeLayout *mapLayout = new RelativeLayout();
	mapLayout->setBackgroundColor(0,0,255);

	for(int i = 0; i < MAX_ISLANDS; i++)
	{
		mIslandButtons[i] = new ImageButton();
		mIslandButtons[i]->setImage(IMAGE_ISLAND);
		mIslandButtons[i]->wrapContentHorizontally();
		mIslandButtons[i]->wrapContentVertically();
		mapLayout->addChild(mIslandButtons[i]);
		mIslandButtons[i]->setVisible(false);
	}

	mMapScreen->addChild(mapLayout);
	mStackScreen->push(mMapScreen);

	mStackScreen->show();
}

int Renderer::loadImage(MAHandle imageHandle)
{

}

void Renderer::getMapSize(int *width, int *height)
{
	*width = mMapScreen->getWidth();
	*height = mMapScreen->getHeight();
}

void Renderer::clearIslands()
{
	for(int i = 0; i < MAX_ISLANDS; i++)
	{
		mIslandButtons[i]->setVisible(false);
	}
}

void Renderer::addIsland(int x, int y)
{
	for(int i = 0; i < MAX_ISLANDS; i++)
	{
		if(!mIslandButtons[i]->isVisible())
		{
			mIslandButtons[i]->setPosition(x,y);
			mIslandButtons[i]->setVisible(true);
			break;
		}
	}
}
