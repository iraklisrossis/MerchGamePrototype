#include <maapi.h>
#include <mastdlib.h>
#include <mavsprintf.h>
#include <MAUtil/Moblet.h>
#include <MAUtil/GLMoblet.h>
#include "maheaders.h"
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
		int scriptSize = maGetDataSize(LUA_SCRIPT);
		mLuaScript = new char[scriptSize + 1];
		maReadData(LUA_SCRIPT, mLuaScript, 0, scriptSize);
		mLuaScript[scriptSize] = '\0';

		mInterpreter.loadScript(mLuaScript);

		maLocationStart();

		Environment::getEnvironment().addCustomEventListener(this);
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

	void customEvent(const MAEvent &event)
	{
		if(event.type == EVENT_TYPE_LOCATION)
		{
			MALocation *loc = (MALocation*)event.data;
			if(loc->state == MA_LOC_QUALIFIED)
			{
				mInterpreter.newCoord(loc->lat, loc->lon);
			}
		}
	}

private:

	// ================== Instance variables ==================
	Renderer mRenderer;

	Interpreter mInterpreter;

	char *mLuaScript;
};

/**
 * Main function that is called when the program starts.
 */
extern "C" int MAMain()
{
	Moblet::run(new Archipelago());
	return 0;
}
