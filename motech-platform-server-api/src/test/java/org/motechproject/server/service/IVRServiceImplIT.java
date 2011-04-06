/**
 * MOTECH PLATFORM OPENSOURCE LICENSE AGREEMENT
 *
 * Copyright (c) 2010-11 The Trustees of Columbia University in the City of
 * New York and Grameen Foundation USA.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Grameen Foundation USA, Columbia University, or
 * their respective contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY GRAMEEN FOUNDATION USA, COLUMBIA UNIVERSITY
 * AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL GRAMEEN FOUNDATION
 * USA, COLUMBIA UNIVERSITY OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.motechproject.server.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.motechproject.model.InitiateCallData;
import org.motechproject.server.service.ivr.IVRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * This is an interactive test. In order to run that test please make sure that Asterisk, Voiceglue and VXML application
 * are properly configures, up and running. Your SIP phone configured to use the "SIP/1001" account and that account registered
 * in Asterisk.
 *
 * In order to run unit test
 * - start your soft phone
 * - run the initiateCallTest()
 * Your soft phone should start ringing. Answer the phone, you should hear a voice message specified in the voice XML document retrieved
 * from the URL specified as a value of the voiceXmlUrl property of the ivrService bean. See testApplicationContext.xml.
 *
 *
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/testIVRAppContext.xml"})
public class IVRServiceImplIT {

    @Autowired
    private IVRService ivrService;

    @Test
    public void initiateCallTest() throws Exception{

        //InitiateCallData initiateCallData = new InitiateCallData(1L, "SIP/1001", 5000, "http://10.0.1.29:8080/TamaIVR/r/wt");
        //InitiateCallData initiateCallData = new InitiateCallData(1L, "SIP/1001", 5000, "http://10.0.1.29:8080/m/module/ar/vxml/ar?r=1");


        //ivrService.initiateCall(initiateCallData);
    }


}
