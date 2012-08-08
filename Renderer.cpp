/*
 * Renderer.cpp
 *
 *  Created on: May 23, 2012
 *      Author: iraklis
 */

#include <GLES/gl.h>
#include "Renderer.h"

Renderer::Renderer()
{
}

/**
 * Called when a fullscreen window with an OpenGL context
 * has been created and is ready to be used.
 */
void Renderer::init()
{
	/*// Set the GL viewport to be the entire MoSync screen.
	setViewport(
		EXTENT_X(maGetScrSize()),
		EXTENT_Y(maGetScrSize()));

	// Initialize OpenGL.
	glShadeModel(GL_SMOOTH);
	glClearDepthf(1.0f);
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LEQUAL);
	glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);
	*/

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
		mIslandButtons[i]->setPosition(i*20,0);
	}

	mMapScreen->addChild(mapLayout);
	mStackScreen->push(mMapScreen);

	mStackScreen->show();
}

/**
 * Setup the projection matrix.
 */
void Renderer::setViewport(int width, int height)
{
	// Protect against divide by zero.
	if (0 == height)
	{
		height = 1;
	}

	// Set viewport and perspective.
	glViewport(0, 0, (GLint)width, (GLint)height);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	GLfloat ratio = (GLfloat)width / (GLfloat)height;
	gluPerspective(45.0f, ratio, 0.1f, 100.0f);
}

/**
 * Standard OpenGL utility function for setting up the
 * perspective projection matrix.
 */
void Renderer::gluPerspective(
	GLfloat fovy,
	GLfloat aspect,
	GLfloat zNear,
	GLfloat zFar)
{
	const float M_PI = 3.14159;

	GLfloat ymax = zNear * tan(fovy * M_PI / 360.0);
	GLfloat ymin = -ymax;
	GLfloat xmin = ymin * aspect;
	GLfloat xmax = ymax * aspect;

	glFrustumf(xmin, xmax, ymin, ymax, zNear, zFar);
}

int Renderer::loadImage(MAHandle imageHandle)
{

}

/**
 * Render the model (draws a quad).
 */
void Renderer::draw(GLfloat z, GLfloat rotation)
{
	// Define quad vertices.
    GLfloat vertices[4][3];
    // Top right.
    vertices[0][0] = 1.0f; vertices[0][1] = 1.0f; vertices[0][2] = 0.0f;
    // Top left.
    vertices[1][0] = -1.0f; vertices[1][1] = 1.0f; vertices[1][2] = 0.0f;
    // Bottom left.
    vertices[2][0] = 1.0f; vertices[2][1] = -1.0f; vertices[2][2] = 0.0f;
    // Bottom right.
    vertices[3][0] = -1.0f; vertices[3][1] = -1.0f; vertices[3][2] = 0.0f;

    // Draw quad.
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glRotatef(rotation, 0.0f, 0.0f, 1.0f);
	glTranslatef(0.0f, 0.0f, -z);
	glClearColor(0.8, 0.9, 0.6, 1.0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glEnableClientState(GL_VERTEX_ARRAY);
	glColor4f(0.9, 0.0, 0.0, 1.0);
	glVertexPointer(3, GL_FLOAT, 0, vertices);
	glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
	glDisableClientState(GL_VERTEX_ARRAY);
	glFinish();
}
