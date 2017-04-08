/***************************************************************
*
*	CS 312
*	Final Project - QtLooper
*	main.cpp
*	Chris Shoemaker shoemakerc
*	3/12/15
*
***************************************************************/

#include "mainwindow.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();

    return a.exec();
}
