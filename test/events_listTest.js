/*global, Hydra, sinon, TestCase, assertEquals*/
(function (core, sinon) {
    'use strict';
    var oModule,
        oTestCase = TestCase;

    function setup() {
        core.test('events_list', function (oMod) {
            oModule = oMod;
        });
    }

    function teardown() {
        oModule.destroy();
        oModule = null;
    }

    oTestCase('EventsListFillList', sinon.testCase({
        setUp:function () {
            /*:DOC += <ul id="list"></ul>*/
            setup();
        },
        tearDown:function () {
            teardown();
        },
        'test should check that oList will be filled with 4 elements':function () {
            var aData = [
                { nId:1, title:'Title1', day:'1'},
                { nId:2, title:'Title2', day:'2'},
                { nId:3, title:'Title3', day:'3'},
                { nId:4, title:'Title4', day:'4'}
            ];
            oModule.oList = document.getElementById('list');

            oModule.fillList(aData);

            assertEquals(4, oModule.oList.getElementsByTagName('li').length);
        }
    }));

    oTestCase('EventsListSetBehavior', sinon.testCase({
        setUp:function () {
            /*:DOC += <ul id="list"><li id="item"></li></ul>*/
            setup();
            oModule.oList = document.getElementById('list');
            sinon.stub(oModule.oList, 'addEventListener');
            sinon.stub(Hydra.bus, 'publish');
        },
        tearDown:function () {
            Hydra.bus.publish.restore();
            oModule.oList.addEventListener.restore();
            teardown();
        },
        'test should check that addEventListener is called one time':function () {
            oModule.setBehavior();

            assertEquals(1, oModule.oList.addEventListener.callCount);
        },
        'test should check that bus.publish is called when triggering click':function () {
            var oCall;
            oModule.oList.addEventListener.yields(
                {
                    target:document.getElementById('item')
                }
            );

            oModule.setBehavior();

            oCall = Hydra.bus.publish.getCall(0);
            assertEquals(1, Hydra.bus.publish.callCount);
            assertEquals('schedule', oCall.args[0]);
            assertEquals('events:loadDetailInfo', oCall.args[1]);
            assertObject(oCall.args[2]);
            assertEquals('item', oCall.args[2].id);
        }
    }));

    oTestCase('EventsListInit', sinon.testCase({
        setUp: function()
        {
            /*:DOC += <ul id="events_list"></ul>*/
            setup();
            sinon.stub(Hydra.module, 'start');
            sinon.stub(Hydra.bus, 'subscribe');
            sinon.stub(oModule, 'setBehavior');
        },
        tearDown: function()
        {
            oModule.setBehavior.restore();
            Hydra.bus.subscribe.restore();
            Hydra.module.start.restore();
            teardown();
        },
        'test should check that event_detail module is started': function()
        {
            var oCall;

            oModule.init();

            oCall = Hydra.module.start.getCall(0);
            assertEquals(1, Hydra.module.start.callCount);

            assertEquals('event_detail', oCall.args[0]);
        },
        'test should check that oList is null by default before execute init': function()
        {
            assertNull(oModule.oList);
        },
        'test should check that oList is events_list element after execute init': function()
        {
            oModule.init();

            assertSame(document.getElementById('events_list'), oModule.oList);
        },
        'test should check that bus.subscribe is called one time': function()
        {
            var oCall;

            oModule.init();

            // The first call is done before calling the init method when subscribing to global channel
            oCall = Hydra.bus.subscribe.getCall(1);

            assertEquals(2, Hydra.bus.subscribe.callCount);
            assertEquals('schedule', oCall.args[0]);
            assertSame(oModule, oCall.args[1]);
        },
        'test should check that setBehavior method is called one time': function()
        {
            oModule.init();

            assertEquals(1, oModule.setBehavior.callCount);
        }
    }));
}(Hydra.module, sinon));