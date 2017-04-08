/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.5.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QRadioButton>
#include <QtWidgets/QSlider>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QWidget *centralWidget;
    QLabel *label_4;
    QLabel *label_5;
    QRadioButton *radioButton_Record1;
    QRadioButton *radioButton_Record2;
    QRadioButton *radioButton_Record3;
    QRadioButton *radioButton_Record4;
    QRadioButton *radioButton_Record5;
    QRadioButton *radioButton_Record6;
    QCheckBox *checkBox_Play6;
    QCheckBox *checkBox_Play2;
    QCheckBox *checkBox_Play1;
    QCheckBox *checkBox_Play4;
    QCheckBox *checkBox_Play3;
    QCheckBox *checkBox_Play5;
    QWidget *layoutWidget;
    QHBoxLayout *horizontalLayout;
    QPushButton *pushButton_Record;
    QPushButton *pushButton_Play;
    QPushButton *pushButton_Stop;
    QWidget *layoutWidget1;
    QVBoxLayout *verticalLayout_6;
    QLabel *label_Volume1;
    QLabel *label_Volume2;
    QLabel *label_Volume3;
    QLabel *label_Volume4;
    QLabel *label_Volume5;
    QLabel *label_Volume6;
    QLabel *label_TrackNum;
    QLabel *label_Inst;
    QLabel *label_Category;
    QLabel *label_Channel;
    QWidget *layoutWidget2;
    QVBoxLayout *verticalLayout;
    QComboBox *comboBox_Channel1;
    QComboBox *comboBox_Channel2;
    QComboBox *comboBox_Channel3;
    QComboBox *comboBox_Channel4;
    QComboBox *comboBox_Channel5;
    QComboBox *comboBox_Channel6;
    QWidget *layoutWidget3;
    QVBoxLayout *verticalLayout_2;
    QComboBox *comboBox_Category1;
    QComboBox *comboBox_Category2;
    QComboBox *comboBox_Category3;
    QComboBox *comboBox_Category4;
    QComboBox *comboBox_Category5;
    QComboBox *comboBox_Category6;
    QWidget *layoutWidget4;
    QVBoxLayout *verticalLayout_3;
    QComboBox *comboBox_Inst1;
    QComboBox *comboBox_Inst2;
    QComboBox *comboBox_Inst3;
    QComboBox *comboBox_Inst4;
    QComboBox *comboBox_Inst5;
    QComboBox *comboBox_Inst6;
    QWidget *layoutWidget5;
    QVBoxLayout *verticalLayout_4;
    QLabel *label_Track1;
    QLabel *label_Track2;
    QLabel *label_Track3;
    QLabel *label_Track4;
    QLabel *label_Track5;
    QLabel *label_Track6;
    QLabel *label_7;
    QWidget *layoutWidget6;
    QVBoxLayout *verticalLayout_5;
    QSlider *horizontalSlider_Volume1;
    QSlider *horizontalSlider_Volume2;
    QSlider *horizontalSlider_Volume3;
    QSlider *horizontalSlider_Volume4;
    QSlider *horizontalSlider_Volume5;
    QSlider *horizontalSlider_Volume6;
    QMenuBar *menuBar;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QStringLiteral("MainWindow"));
        MainWindow->resize(950, 360);
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        label_4 = new QLabel(centralWidget);
        label_4->setObjectName(QStringLiteral("label_4"));
        label_4->setGeometry(QRect(575, 10, 51, 16));
        label_4->setAlignment(Qt::AlignCenter);
        label_5 = new QLabel(centralWidget);
        label_5->setObjectName(QStringLiteral("label_5"));
        label_5->setGeometry(QRect(630, 10, 41, 16));
        label_5->setAlignment(Qt::AlignCenter);
        radioButton_Record1 = new QRadioButton(centralWidget);
        radioButton_Record1->setObjectName(QStringLiteral("radioButton_Record1"));
        radioButton_Record1->setGeometry(QRect(590, 30, 21, 20));
        radioButton_Record2 = new QRadioButton(centralWidget);
        radioButton_Record2->setObjectName(QStringLiteral("radioButton_Record2"));
        radioButton_Record2->setGeometry(QRect(590, 60, 21, 20));
        radioButton_Record3 = new QRadioButton(centralWidget);
        radioButton_Record3->setObjectName(QStringLiteral("radioButton_Record3"));
        radioButton_Record3->setGeometry(QRect(590, 90, 21, 20));
        radioButton_Record4 = new QRadioButton(centralWidget);
        radioButton_Record4->setObjectName(QStringLiteral("radioButton_Record4"));
        radioButton_Record4->setGeometry(QRect(590, 120, 21, 21));
        radioButton_Record5 = new QRadioButton(centralWidget);
        radioButton_Record5->setObjectName(QStringLiteral("radioButton_Record5"));
        radioButton_Record5->setGeometry(QRect(590, 150, 21, 20));
        radioButton_Record6 = new QRadioButton(centralWidget);
        radioButton_Record6->setObjectName(QStringLiteral("radioButton_Record6"));
        radioButton_Record6->setGeometry(QRect(590, 180, 21, 20));
        checkBox_Play6 = new QCheckBox(centralWidget);
        checkBox_Play6->setObjectName(QStringLiteral("checkBox_Play6"));
        checkBox_Play6->setGeometry(QRect(640, 180, 21, 20));
        checkBox_Play2 = new QCheckBox(centralWidget);
        checkBox_Play2->setObjectName(QStringLiteral("checkBox_Play2"));
        checkBox_Play2->setGeometry(QRect(640, 60, 21, 20));
        checkBox_Play1 = new QCheckBox(centralWidget);
        checkBox_Play1->setObjectName(QStringLiteral("checkBox_Play1"));
        checkBox_Play1->setGeometry(QRect(640, 30, 21, 20));
        checkBox_Play4 = new QCheckBox(centralWidget);
        checkBox_Play4->setObjectName(QStringLiteral("checkBox_Play4"));
        checkBox_Play4->setGeometry(QRect(640, 120, 21, 20));
        checkBox_Play3 = new QCheckBox(centralWidget);
        checkBox_Play3->setObjectName(QStringLiteral("checkBox_Play3"));
        checkBox_Play3->setGeometry(QRect(640, 90, 21, 20));
        checkBox_Play5 = new QCheckBox(centralWidget);
        checkBox_Play5->setObjectName(QStringLiteral("checkBox_Play5"));
        checkBox_Play5->setGeometry(QRect(640, 150, 21, 20));
        layoutWidget = new QWidget(centralWidget);
        layoutWidget->setObjectName(QStringLiteral("layoutWidget"));
        layoutWidget->setGeometry(QRect(600, 240, 291, 32));
        horizontalLayout = new QHBoxLayout(layoutWidget);
        horizontalLayout->setSpacing(6);
        horizontalLayout->setContentsMargins(11, 11, 11, 11);
        horizontalLayout->setObjectName(QStringLiteral("horizontalLayout"));
        horizontalLayout->setContentsMargins(0, 0, 0, 0);
        pushButton_Record = new QPushButton(layoutWidget);
        pushButton_Record->setObjectName(QStringLiteral("pushButton_Record"));

        horizontalLayout->addWidget(pushButton_Record);

        pushButton_Play = new QPushButton(layoutWidget);
        pushButton_Play->setObjectName(QStringLiteral("pushButton_Play"));

        horizontalLayout->addWidget(pushButton_Play);

        pushButton_Stop = new QPushButton(layoutWidget);
        pushButton_Stop->setObjectName(QStringLiteral("pushButton_Stop"));

        horizontalLayout->addWidget(pushButton_Stop);

        layoutWidget1 = new QWidget(centralWidget);
        layoutWidget1->setObjectName(QStringLiteral("layoutWidget1"));
        layoutWidget1->setGeometry(QRect(900, 30, 31, 171));
        verticalLayout_6 = new QVBoxLayout(layoutWidget1);
        verticalLayout_6->setSpacing(6);
        verticalLayout_6->setContentsMargins(11, 11, 11, 11);
        verticalLayout_6->setObjectName(QStringLiteral("verticalLayout_6"));
        verticalLayout_6->setContentsMargins(0, 0, 0, 0);
        label_Volume1 = new QLabel(layoutWidget1);
        label_Volume1->setObjectName(QStringLiteral("label_Volume1"));
        label_Volume1->setAlignment(Qt::AlignCenter);

        verticalLayout_6->addWidget(label_Volume1);

        label_Volume2 = new QLabel(layoutWidget1);
        label_Volume2->setObjectName(QStringLiteral("label_Volume2"));
        label_Volume2->setAlignment(Qt::AlignCenter);

        verticalLayout_6->addWidget(label_Volume2);

        label_Volume3 = new QLabel(layoutWidget1);
        label_Volume3->setObjectName(QStringLiteral("label_Volume3"));
        label_Volume3->setAlignment(Qt::AlignCenter);

        verticalLayout_6->addWidget(label_Volume3);

        label_Volume4 = new QLabel(layoutWidget1);
        label_Volume4->setObjectName(QStringLiteral("label_Volume4"));
        label_Volume4->setAlignment(Qt::AlignCenter);

        verticalLayout_6->addWidget(label_Volume4);

        label_Volume5 = new QLabel(layoutWidget1);
        label_Volume5->setObjectName(QStringLiteral("label_Volume5"));
        label_Volume5->setAlignment(Qt::AlignCenter);

        verticalLayout_6->addWidget(label_Volume5);

        label_Volume6 = new QLabel(layoutWidget1);
        label_Volume6->setObjectName(QStringLiteral("label_Volume6"));
        label_Volume6->setAlignment(Qt::AlignCenter);

        verticalLayout_6->addWidget(label_Volume6);

        label_TrackNum = new QLabel(centralWidget);
        label_TrackNum->setObjectName(QStringLiteral("label_TrackNum"));
        label_TrackNum->setGeometry(QRect(20, 10, 41, 16));
        label_TrackNum->setAlignment(Qt::AlignCenter);
        label_Inst = new QLabel(centralWidget);
        label_Inst->setObjectName(QStringLiteral("label_Inst"));
        label_Inst->setGeometry(QRect(360, 10, 211, 16));
        label_Inst->setAlignment(Qt::AlignCenter);
        label_Category = new QLabel(centralWidget);
        label_Category->setObjectName(QStringLiteral("label_Category"));
        label_Category->setGeometry(QRect(150, 10, 191, 16));
        label_Category->setAlignment(Qt::AlignCenter);
        label_Channel = new QLabel(centralWidget);
        label_Channel->setObjectName(QStringLiteral("label_Channel"));
        label_Channel->setGeometry(QRect(80, 10, 61, 16));
        label_Channel->setAlignment(Qt::AlignCenter);
        layoutWidget2 = new QWidget(centralWidget);
        layoutWidget2->setObjectName(QStringLiteral("layoutWidget2"));
        layoutWidget2->setGeometry(QRect(80, 30, 61, 181));
        verticalLayout = new QVBoxLayout(layoutWidget2);
        verticalLayout->setSpacing(6);
        verticalLayout->setContentsMargins(11, 11, 11, 11);
        verticalLayout->setObjectName(QStringLiteral("verticalLayout"));
        verticalLayout->setContentsMargins(0, 0, 0, 0);
        comboBox_Channel1 = new QComboBox(layoutWidget2);
        comboBox_Channel1->setObjectName(QStringLiteral("comboBox_Channel1"));

        verticalLayout->addWidget(comboBox_Channel1);

        comboBox_Channel2 = new QComboBox(layoutWidget2);
        comboBox_Channel2->setObjectName(QStringLiteral("comboBox_Channel2"));

        verticalLayout->addWidget(comboBox_Channel2);

        comboBox_Channel3 = new QComboBox(layoutWidget2);
        comboBox_Channel3->setObjectName(QStringLiteral("comboBox_Channel3"));

        verticalLayout->addWidget(comboBox_Channel3);

        comboBox_Channel4 = new QComboBox(layoutWidget2);
        comboBox_Channel4->setObjectName(QStringLiteral("comboBox_Channel4"));

        verticalLayout->addWidget(comboBox_Channel4);

        comboBox_Channel5 = new QComboBox(layoutWidget2);
        comboBox_Channel5->setObjectName(QStringLiteral("comboBox_Channel5"));

        verticalLayout->addWidget(comboBox_Channel5);

        comboBox_Channel6 = new QComboBox(layoutWidget2);
        comboBox_Channel6->setObjectName(QStringLiteral("comboBox_Channel6"));

        verticalLayout->addWidget(comboBox_Channel6);

        layoutWidget3 = new QWidget(centralWidget);
        layoutWidget3->setObjectName(QStringLiteral("layoutWidget3"));
        layoutWidget3->setGeometry(QRect(150, 30, 191, 181));
        verticalLayout_2 = new QVBoxLayout(layoutWidget3);
        verticalLayout_2->setSpacing(6);
        verticalLayout_2->setContentsMargins(11, 11, 11, 11);
        verticalLayout_2->setObjectName(QStringLiteral("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(0, 0, 0, 0);
        comboBox_Category1 = new QComboBox(layoutWidget3);
        comboBox_Category1->setObjectName(QStringLiteral("comboBox_Category1"));

        verticalLayout_2->addWidget(comboBox_Category1);

        comboBox_Category2 = new QComboBox(layoutWidget3);
        comboBox_Category2->setObjectName(QStringLiteral("comboBox_Category2"));

        verticalLayout_2->addWidget(comboBox_Category2);

        comboBox_Category3 = new QComboBox(layoutWidget3);
        comboBox_Category3->setObjectName(QStringLiteral("comboBox_Category3"));

        verticalLayout_2->addWidget(comboBox_Category3);

        comboBox_Category4 = new QComboBox(layoutWidget3);
        comboBox_Category4->setObjectName(QStringLiteral("comboBox_Category4"));

        verticalLayout_2->addWidget(comboBox_Category4);

        comboBox_Category5 = new QComboBox(layoutWidget3);
        comboBox_Category5->setObjectName(QStringLiteral("comboBox_Category5"));

        verticalLayout_2->addWidget(comboBox_Category5);

        comboBox_Category6 = new QComboBox(layoutWidget3);
        comboBox_Category6->setObjectName(QStringLiteral("comboBox_Category6"));

        verticalLayout_2->addWidget(comboBox_Category6);

        layoutWidget4 = new QWidget(centralWidget);
        layoutWidget4->setObjectName(QStringLiteral("layoutWidget4"));
        layoutWidget4->setGeometry(QRect(360, 30, 211, 181));
        verticalLayout_3 = new QVBoxLayout(layoutWidget4);
        verticalLayout_3->setSpacing(6);
        verticalLayout_3->setContentsMargins(11, 11, 11, 11);
        verticalLayout_3->setObjectName(QStringLiteral("verticalLayout_3"));
        verticalLayout_3->setContentsMargins(0, 0, 0, 0);
        comboBox_Inst1 = new QComboBox(layoutWidget4);
        comboBox_Inst1->setObjectName(QStringLiteral("comboBox_Inst1"));

        verticalLayout_3->addWidget(comboBox_Inst1);

        comboBox_Inst2 = new QComboBox(layoutWidget4);
        comboBox_Inst2->setObjectName(QStringLiteral("comboBox_Inst2"));

        verticalLayout_3->addWidget(comboBox_Inst2);

        comboBox_Inst3 = new QComboBox(layoutWidget4);
        comboBox_Inst3->setObjectName(QStringLiteral("comboBox_Inst3"));

        verticalLayout_3->addWidget(comboBox_Inst3);

        comboBox_Inst4 = new QComboBox(layoutWidget4);
        comboBox_Inst4->setObjectName(QStringLiteral("comboBox_Inst4"));

        verticalLayout_3->addWidget(comboBox_Inst4);

        comboBox_Inst5 = new QComboBox(layoutWidget4);
        comboBox_Inst5->setObjectName(QStringLiteral("comboBox_Inst5"));

        verticalLayout_3->addWidget(comboBox_Inst5);

        comboBox_Inst6 = new QComboBox(layoutWidget4);
        comboBox_Inst6->setObjectName(QStringLiteral("comboBox_Inst6"));

        verticalLayout_3->addWidget(comboBox_Inst6);

        layoutWidget5 = new QWidget(centralWidget);
        layoutWidget5->setObjectName(QStringLiteral("layoutWidget5"));
        layoutWidget5->setGeometry(QRect(20, 30, 41, 171));
        verticalLayout_4 = new QVBoxLayout(layoutWidget5);
        verticalLayout_4->setSpacing(6);
        verticalLayout_4->setContentsMargins(11, 11, 11, 11);
        verticalLayout_4->setObjectName(QStringLiteral("verticalLayout_4"));
        verticalLayout_4->setContentsMargins(0, 0, 0, 0);
        label_Track1 = new QLabel(layoutWidget5);
        label_Track1->setObjectName(QStringLiteral("label_Track1"));
        label_Track1->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label_Track1);

        label_Track2 = new QLabel(layoutWidget5);
        label_Track2->setObjectName(QStringLiteral("label_Track2"));
        label_Track2->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label_Track2);

        label_Track3 = new QLabel(layoutWidget5);
        label_Track3->setObjectName(QStringLiteral("label_Track3"));
        label_Track3->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label_Track3);

        label_Track4 = new QLabel(layoutWidget5);
        label_Track4->setObjectName(QStringLiteral("label_Track4"));
        label_Track4->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label_Track4);

        label_Track5 = new QLabel(layoutWidget5);
        label_Track5->setObjectName(QStringLiteral("label_Track5"));
        label_Track5->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label_Track5);

        label_Track6 = new QLabel(layoutWidget5);
        label_Track6->setObjectName(QStringLiteral("label_Track6"));
        label_Track6->setAlignment(Qt::AlignCenter);

        verticalLayout_4->addWidget(label_Track6);

        label_7 = new QLabel(centralWidget);
        label_7->setObjectName(QStringLiteral("label_7"));
        label_7->setGeometry(QRect(678, 11, 211, 16));
        label_7->setAlignment(Qt::AlignCenter);
        layoutWidget6 = new QWidget(centralWidget);
        layoutWidget6->setObjectName(QStringLiteral("layoutWidget6"));
        layoutWidget6->setGeometry(QRect(680, 30, 211, 181));
        verticalLayout_5 = new QVBoxLayout(layoutWidget6);
        verticalLayout_5->setSpacing(6);
        verticalLayout_5->setContentsMargins(11, 11, 11, 11);
        verticalLayout_5->setObjectName(QStringLiteral("verticalLayout_5"));
        verticalLayout_5->setContentsMargins(0, 0, 0, 0);
        horizontalSlider_Volume1 = new QSlider(layoutWidget6);
        horizontalSlider_Volume1->setObjectName(QStringLiteral("horizontalSlider_Volume1"));
        horizontalSlider_Volume1->setMaximum(127);
        horizontalSlider_Volume1->setOrientation(Qt::Horizontal);

        verticalLayout_5->addWidget(horizontalSlider_Volume1);

        horizontalSlider_Volume2 = new QSlider(layoutWidget6);
        horizontalSlider_Volume2->setObjectName(QStringLiteral("horizontalSlider_Volume2"));
        horizontalSlider_Volume2->setMaximum(127);
        horizontalSlider_Volume2->setOrientation(Qt::Horizontal);

        verticalLayout_5->addWidget(horizontalSlider_Volume2);

        horizontalSlider_Volume3 = new QSlider(layoutWidget6);
        horizontalSlider_Volume3->setObjectName(QStringLiteral("horizontalSlider_Volume3"));
        horizontalSlider_Volume3->setMaximum(127);
        horizontalSlider_Volume3->setOrientation(Qt::Horizontal);

        verticalLayout_5->addWidget(horizontalSlider_Volume3);

        horizontalSlider_Volume4 = new QSlider(layoutWidget6);
        horizontalSlider_Volume4->setObjectName(QStringLiteral("horizontalSlider_Volume4"));
        horizontalSlider_Volume4->setMaximum(127);
        horizontalSlider_Volume4->setOrientation(Qt::Horizontal);

        verticalLayout_5->addWidget(horizontalSlider_Volume4);

        horizontalSlider_Volume5 = new QSlider(layoutWidget6);
        horizontalSlider_Volume5->setObjectName(QStringLiteral("horizontalSlider_Volume5"));
        horizontalSlider_Volume5->setMaximum(127);
        horizontalSlider_Volume5->setOrientation(Qt::Horizontal);

        verticalLayout_5->addWidget(horizontalSlider_Volume5);

        horizontalSlider_Volume6 = new QSlider(layoutWidget6);
        horizontalSlider_Volume6->setObjectName(QStringLiteral("horizontalSlider_Volume6"));
        horizontalSlider_Volume6->setMaximum(127);
        horizontalSlider_Volume6->setOrientation(Qt::Horizontal);

        verticalLayout_5->addWidget(horizontalSlider_Volume6);

        MainWindow->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(MainWindow);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 950, 22));
        MainWindow->setMenuBar(menuBar);
        mainToolBar = new QToolBar(MainWindow);
        mainToolBar->setObjectName(QStringLiteral("mainToolBar"));
        MainWindow->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(MainWindow);
        statusBar->setObjectName(QStringLiteral("statusBar"));
        MainWindow->setStatusBar(statusBar);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "MainWindow", 0));
        label_4->setText(QApplication::translate("MainWindow", "Record", 0));
        label_5->setText(QApplication::translate("MainWindow", "Play", 0));
        radioButton_Record1->setText(QString());
        radioButton_Record2->setText(QString());
        radioButton_Record3->setText(QString());
        radioButton_Record4->setText(QString());
        radioButton_Record5->setText(QString());
        radioButton_Record6->setText(QString());
        checkBox_Play6->setText(QString());
        checkBox_Play2->setText(QString());
        checkBox_Play1->setText(QString());
        checkBox_Play4->setText(QString());
        checkBox_Play3->setText(QString());
        checkBox_Play5->setText(QString());
        pushButton_Record->setText(QApplication::translate("MainWindow", "Record", 0));
        pushButton_Play->setText(QApplication::translate("MainWindow", "Play", 0));
        pushButton_Stop->setText(QApplication::translate("MainWindow", "Stop", 0));
        label_Volume1->setText(QApplication::translate("MainWindow", "0", 0));
        label_Volume2->setText(QApplication::translate("MainWindow", "0", 0));
        label_Volume3->setText(QApplication::translate("MainWindow", "0", 0));
        label_Volume4->setText(QApplication::translate("MainWindow", "0", 0));
        label_Volume5->setText(QApplication::translate("MainWindow", "0", 0));
        label_Volume6->setText(QApplication::translate("MainWindow", "0", 0));
        label_TrackNum->setText(QApplication::translate("MainWindow", "Track", 0));
        label_Inst->setText(QApplication::translate("MainWindow", "Instrument", 0));
        label_Category->setText(QApplication::translate("MainWindow", "Category", 0));
        label_Channel->setText(QApplication::translate("MainWindow", "Channel", 0));
        label_Track1->setText(QApplication::translate("MainWindow", "1", 0));
        label_Track2->setText(QApplication::translate("MainWindow", "2", 0));
        label_Track3->setText(QApplication::translate("MainWindow", "3", 0));
        label_Track4->setText(QApplication::translate("MainWindow", "4", 0));
        label_Track5->setText(QApplication::translate("MainWindow", "5", 0));
        label_Track6->setText(QApplication::translate("MainWindow", "6", 0));
        label_7->setText(QApplication::translate("MainWindow", "Volume", 0));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
