---
layout: post
title:  "关于这个博客!"
date:   2015-03-08 22:21:49
categories: 其他
tags: 其他
---

{% highlight css %} .element { height: 100px; transition: height 2s linear; }

.element:hover { height: 200px; } {% endhighlight %}

{% highlight java %}package com.cnwir.customview;

import android.content.Context; import android.graphics.Canvas; import android.graphics.Color; import android.graphics.Paint; import android.graphics.Path; import android.graphics.Point; import android.util.AttributeSet; import android.view.MotionEvent; import android.view.View;

import java.util.ArrayList; import java.util.List;

/**

Created by heaven on 2015/6/12. */ public class SimpleDrawingView extends View {

private final int color = Color.BLACK;

private Paint mPaint;

private List points;

private Path mPath = new Path();

public SimpleDrawingView(Context context) { super(context); }

public SimpleDrawingView(Context context, AttributeSet attrs) { super(context, attrs); // setFocusable(true); // setFocusableInTouchMode(true); // setPaint(); setPaint_1(); }

@Override protected void onDraw(Canvas canvas) {

// canvas.drawCircle(50, 50, 20, mPaint); // mPaint.setColor(Color.GREEN); // canvas.drawCircle(50, 100, 20, mPaint); // mPaint.setColor(Color.RED); // canvas.drawCircle(50, 150, 20, mPaint);

// for (Point point : points) { // // canvas.drawCircle(point.x, point.y, 20, mPaint); // } canvas.drawPath(mPath, mPaint);

}

private void setPaint() {
    mPaint = new Paint();
    mPaint.setColor(color);
    //设置颜色的透明度
    mPaint.setAlpha(255);
    //设置反锯齿
    mPaint.setAntiAlias(true);
    //设置描边的宽度,单位像素
    mPaint.setStrokeWidth(5);
    //设置画笔的类型为描边

    /**
     *  画笔样式分三种：
     * 1.Paint.Style.STROKE：描边
     * 2.Paint.Style.FILL_AND_STROKE：描边并填充
     * 3.Paint.Style.FILL：填充
     *
     * */
    mPaint.setStyle(Paint.Style.STROKE);
    mPaint.setStrokeJoin(Paint.Join.ROUND);
    mPaint.setStrokeCap(Paint.Cap.ROUND);
}

private void setPaint_1() {
    mPaint = new Paint();
    mPaint.setColor(color);
    mPaint.setStyle(Paint.Style.STROKE);
    mPaint.setStrokeWidth(5);
    points = new ArrayList<Point>();

}

@Override
public boolean onTouchEvent(MotionEvent event) {
// float touchX = event.getX(); // float touchY = event.getY(); // points.add(new Point(Math.round(touchX), Math.round(touchY)));

    float touchX = event.getX();
    float touchY = event.getY();

    switch (event.getAction()) {

        case MotionEvent.ACTION_DOWN:

            mPath.moveTo(touchX, touchY);
            break;
        case MotionEvent.ACTION_MOVE:
            mPath.lineTo(touchX, touchY);
            break;
        default:
            break;

    }


    postInvalidate();
    return true;
}
} {% endhighlight %}