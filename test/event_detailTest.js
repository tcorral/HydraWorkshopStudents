/*global, Hydra, sinon, TestCase*/
(function (core, sinon) {
    'use strict';
    var oModule,
        oTestCase = TestCase;

    function setup() {
        core.test('event_detail', function (oMod) {
            oModule = oMod;
        });
    }

    function teardown() {
        oModule.destroy();
        oModule = null;
    }

    oTestCase('EventDetailCreateDetail', sinon.stub({
        setUp:function () {
            setup();
            oModule.oDetail = document.body;
            this.oData = {
                title:'Title',
                description:'Description'
            };
            sinon.stub(document, 'createElement');
        },
        tearDown:function () {
            document.createElement.restore();
            teardown();
        },
        'test should check that createDetail is a function':function () {
            assertFunction(oModule.createDetail);
        },
        'test should check that createElement must be called three times':function () {
            oModule.createDetail();

            assertEquals(2, document.getElementsByTagName('div').length);
            assertEquals(1, document.getElementsByTagName('h1').length);

            assertEquals(this.oData.title, document.getElementsByTagName('h1')[0].innerHTML);
            assertEquals(this.oData.description, document.getElementsByTagName('div')[1].innerHTML);
        }
    }));

    oTestCase('EventDetailInit', sinon.testCase({
        setUp:function () {
            /*:DOC += <div id="detail"></div>*/
            setup();
            sinon.stub(Hydra.bus, 'subscribe');
        },
        tearDown:function () {
            Hydra.bus.subscribe.restore();
            teardown();
        },
        'test should check that oDetail is null before execute init':function () {
            assertNull(oModule.oDetail);
        },
        'test should check that oDetail is calendarContainer after execute init':function () {
            oModule.init();

            assertSame(document.getElementById('detail'), oModule.oDetail);
        },
        'test should check that bus.subscribe is called one time':function () {
            var oCall;

            oModule.init();

            oCall = Hydra.bus.subscribe.getCall(1);
            assertEquals('schedule', oCall.args[0]);
            assertSame(oModule, oCall.args[1]);
        }
    }));

    oTestCase('EventDetailOnDestroy', sinon.testCase({
        setUp:function () {
            setup();
            sinon.stub(Hydra.bus, 'unsubscribe');
        },
        tearDown:function () {
            Hydra.bus.unsubscribe.restore();
            teardown();
        },
        'test should check that onDestroy method calls bus.unsubscribe one time':function () {
            var oCall;

            oModule.onDestroy();

            oCall = Hydra.bus.unsubscribe.getCall(0);
            assertEquals('schedule', oCall.args[0]);
            assertSame(oModule, oCall.args[1]);
        }
    }));

    oTestCase('EventDetailCallbacks', sinon.testCase({
        setUp:function () {
            setup();
            /*:DOC += <div id="detail"></div>*/
            sinon.stub(window, 'alert');
            sinon.stub(Hydra.ajax, 'call');
            sinon.stub(App.data, 'getFilteredDataById');
            sinon.stub(oModule, 'createDetail');
        },
        tearDown:function () {
            window.alert.restore();
            Hydra.ajax.call.restore();
            App.data.getFilteredDataById.restore();
            oModule.createDetail.restore();
            teardown();
        },
        'test should check that alert method is called when executing global:sample':function () {
            var oCall;

            oModule.oEventsCallbacks['global:sample'].call(oModule);

            oCall = window.alert.getCall(0);
            assertEquals(1, window.alert.callCount);
            assertEquals('Calling Global sample', oCall.args[0]);
        },
        'test should check that ajax call is called when executing events:loadDetailInfo':function () {
            var oData = { id:10 },
                oCall;

            oModule.oEventsCallbacks['events:loadDetailInfo'].call(oModule, oData);

            oCall = Hydra.ajax.call.getCall(0);
            assertEquals(1, Hydra.ajax.call.callCount);
            assertObject(oCall.args[0]);
            assertEquals(App.url.generateDatabaseURL, oCall.args[0].url);
            assertEquals('json', oCall.args[0].dataType);
            assertFunction(oCall.args[0].success);
            assertFunction(oCall.args[0].error);
        },
        'test should check that success method of ajax call in events:loadDetailInfo must be called one time':function () {
            var oData = { id:10 },
                oArgs;

            oModule.oEventsCallbacks['events:loadDetailInfo'].call(oModule, oData);

            oArgs = Hydra.ajax.call.getCall(0).args;

            oArgs[0].success({});

            assertEquals(1, oModule.createDetail.callCount);
            assertEquals(1, App.data.getFilteredDataById.callCount);
        },
        'test should check that oDetail will be empty after execute events:cleanDetail': function()
        {
            oModule.oDetail = document.getElementById('detail');
            oModule.oDetail.innerHTML = 'Test';

            oModule.oEventsCallbacks['events:cleanDetail'].call(oModule, {});

            assertEquals('', oModule.oDetail.innerHTML);
        }
    }));
}(Hydra.module, sinon));