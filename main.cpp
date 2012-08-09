#include <maapi.h>
#include <mastdlib.h>
#include <mavsprintf.h>
#include <MAUtil/Moblet.h>
#include <MAUtil/GLMoblet.h>
#include <GLES/gl.h>
#include "Renderer.h"
#include "Interpreter.h"

using namespace MAUtil;

/**
 * Moblet to be used as a template for an Open GL application.
 * The template program draws a rotating quad. Touch the
 * screen to change the depth coordinate.
 */
class Archipelago : public Moblet
{
public:

	// ================== Constructor ==================

	/**
	 * Initialize rendering parameters.
	 */
	Archipelago()
	{
		mRenderer.initialize();
		mInterpreter.initialize(&mRenderer);
	}

	// ================== Event methods ==================

	/**
	 * Called when a fullscreen window with an OpenGL context
	 * has been created and is ready to be used.
	 */
	void init()
	{
		//mRenderer.init();
	}

	/**
	 * Called when a key is pressed.
	 */
	void keyPressEvent(int keyCode, int nativeCode)
	{
		if (MAK_BACK == keyCode || MAK_0 == keyCode)
		{
			// Call close to exit the application.
			close();
		}
	}

private:

	// ================== Instance variables ==================
	Renderer mRenderer;

	Interpreter mInterpreter;
};

/**
 * Main function that is called when the program starts.
 */
extern "C" int MAMain()
{
	Moblet::run(new Archipelago());
	return 0;
}
