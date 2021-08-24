package com.gsr.blogger.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gsr.blogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MUser.class);
        MUser mUser1 = new MUser();
        mUser1.setId(1L);
        MUser mUser2 = new MUser();
        mUser2.setId(mUser1.getId());
        assertThat(mUser1).isEqualTo(mUser2);
        mUser2.setId(2L);
        assertThat(mUser1).isNotEqualTo(mUser2);
        mUser1.setId(null);
        assertThat(mUser1).isNotEqualTo(mUser2);
    }
}
