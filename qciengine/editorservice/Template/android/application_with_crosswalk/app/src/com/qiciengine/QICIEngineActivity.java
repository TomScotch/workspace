package com.qiciengine;

import org.xwalk.core.XWalkView;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;


public class QICIEngineActivity extends Activity {
    private static String TAG = "QICIEngineActivity";
    private XWalkView mXWalkView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mXWalkView = new XWalkView(this);
        ViewGroup.LayoutParams layout = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        setContentView(mXWalkView, layout);
        mXWalkView.load("file:///android_asset/StartGame.html", null);
    }

    protected int getResourceId(Context action, String name, String type) {
        int id = action.getResources().getIdentifier(name, type, action.getClass().getPackage().getName());
        if (id == 0) {
            id = action.getResources().getIdentifier(name, type, action.getPackageName());
            if (id == 0) {
                Log.e(TAG, String.format("res/%s/%s is missing", type, name, type));
            }
        }
        return id;
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (mXWalkView != null) {
            mXWalkView.pauseTimers();
            mXWalkView.onHide();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mXWalkView != null) {
            mXWalkView.resumeTimers();
            mXWalkView.onShow();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mXWalkView != null) {
            mXWalkView.onDestroy();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (mXWalkView != null) {
            mXWalkView.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        if (mXWalkView != null) {
            mXWalkView.onNewIntent(intent);
        }
    }
}
