/*global, Hydra, sinon, TestCase*/
(function(core, sinon)
{
    'use strict';
    var oModule,
        oTestCase = TestCase;

    function setup()
    {
        core.test('calendar', function(oMod)
        {
            oModule = oMod;
        });
    }
    function teardown()
    {
        oModule.destroy();
        oModule = null;
    }

    oTestCase('CalendarStartCalendar', sinon.testCase({
        setUp: function()
        {
            setup();
        },
        tearDown: function()
        {
            teardown();
        },
        'test should check that startCalendar is a function': function()
        {
            assertFunction(oModule.startCalendar);
        },
        'test should check that oCalendar is null before execute startCalendar': function()
        {
            assertNull(oModule.oCalendar);
        },
        'test should check that startCalendar must set a Calendar instance': function()
        {
            /*:DOC += <div id="calendarContainer"></div>*/

            oModule.startCalendar();

            assertInstanceOf(Calendar, oModule.oCalendar);
        }
    }));

    oTestCase('CalendarSetBehavior', sinon.stub({
        setUp: function()
        {
            setup();
            /*:DOC += <div id="calendarContainer"></div>*/

            oModule.startCalendar();
        },
        tearDown: function()
        {
            teardown();
        },
        'test should check that setBehavior is a function': function()
        {
            assertFunction(oModule.setBehavior);
        },
        'test should check that onSelectDate is an empty function by default': function()
        {
            assertEquals(0, this.oCalendar.onSelectDate.getBody().length);
        },
        'test should check that onChangeMonth is an empty function by default': function()
        {
            assertEquals(0, this.oCalendar.onSelectDate.getBody().length);
        },
        'test should check that onSelectDate is not an empty function after execute setBehavior': function()
        {
            oModule.setBehavior();

            assertNotEquals(0, this.oCalendar.onSelectDate.getBody().length);
        },
        'test should check that onChangeMonth is not an empty function after execute setBehavior': function()
        {
            oModule.setBehavior();

            assertNotEquals(0, this.oCalendar.onChangeMonth.getBody().length);
        }
    }));

    oTestCase('CalendarFunctionsOnSetBehavior', sinon.testCase({
        setUp: function()
        {
            setup();
            /*:DOC += <div id="calendarContainer"></div>*/
            oModule.startCalendar();
            oModule.setBehavior();
            sinon.stub(Hydra.bus, 'publish');
        },
        tearDown: function()
        {
            Hydra.bus.publish.restore();
            teardown();
        },
        'test should check that when executing onSelectDate publish will call bus.publish': function()
        {
            var oCall;

            oModule.oCalendar.onSelectDate();

            oCall = Hydra.bus.publish.getCall(0);
            assertEquals(1, Hydra.bus.publish.callCount);
            assertEquals('schedule', oCall.args[0]);
            assertEquals('events:byDay', oCall.args[1]);
            assertObject(oCall.args[2]);
            assertEquals(oModule.oCalendar.nYearSelected, oCall.args[2].year);
            assertEquals(oModule.oCalendar.nMonthSelected, oCall.args[2].month);
            assertEquals(oModule.oCalendar.nDaySelected, oCall.args[2].day);
        },
        'test should check that when executing onChangeMonth publish will call bus.publish': function()
        {
            var oCall, oCall2;

            oModule.oCalendar.onChangeMonth();

            oCall = Hydra.bus.publish.getCall(0);
            oCall2 = Hydra.bus.publish.getCall(1);
            assertEquals(2, Hydra.bus.publish.callCount);
            assertEquals('schedule', oCall.args[0]);
            assertEquals('events:cleanList', oCall.args[1]);
            assertObject(oCall.args[2]);

            assertEquals('schedule', oCall2.args[0]);
            assertEquals('events:byMonth', oCall2.args[1]);
            assertObject(oCall2.args[2]);
            assertEquals(oModule.oCalendar.nYear, oCall2.args[2].year);
            assertEquals(oModule.oCalendar.nMonth, oCall2.args[2].month);
            assertEquals(oModule.oCalendar.nDay, oCall2.args[2].day);

        }
    }));

    oTestCase('CalendarInit', sinon.testCase({
        setUp: function()
        {
            var oCalendar = new Calendar();
            setup();
            sinon.stub(Hydra.module, 'start');
            sinon.stub(oModule, 'startCalendar', function()
            {
                oModule.oCalendar = oCalendar;
            });
            sinon.stub(oModule, 'setBehavior');
            sinon.stub(oCalendar, 'onChangeMonth');
        },
        tearDown: function()
        {
            Hydra.module.start.restore();
            oModule.startCalendar.restore();
            oModule.setBehavior.restore();
            oModule.oCalendar.onChangeMonth.restore();
            teardown();
        },
        'test should check that start method is called one time': function()
        {
            var oCall;

            oModule.init();

            oCall = Hydra.module.start.getCall(0);
            assertEquals(1, Hydra.module.start.callCount);
            assertEquals('events_list', oCall.args[0]);
        },
        'test should check that startCalendar is called one time': function()
        {
            oModule.init();

            assertEquals(1, oModule.startCalendar.callCount);
        },
        'test should check that setBehavior is called one time': function()
        {
            oModule.init();

            assertEquals(1, oModule.setBehavior.callCount);
        },
        'test should check that oCalendar.onChangeMont is called one time': function()
        {
            oModule.init();

            assertEquals(1, oModule.oCalendar.onChangeMonth.callCount);
        }
    }));
}(Hydra.module, sinon));