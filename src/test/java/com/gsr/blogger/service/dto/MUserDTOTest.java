package com.gsr.blogger.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.gsr.blogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MUserDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MUserDTO.class);
        MUserDTO mUserDTO1 = new MUserDTO();
        mUserDTO1.setId(1L);
        MUserDTO mUserDTO2 = new MUserDTO();
        assertThat(mUserDTO1).isNotEqualTo(mUserDTO2);
        mUserDTO2.setId(mUserDTO1.getId());
        assertThat(mUserDTO1).isEqualTo(mUserDTO2);
        mUserDTO2.setId(2L);
        assertThat(mUserDTO1).isNotEqualTo(mUserDTO2);
        mUserDTO1.setId(null);
        assertThat(mUserDTO1).isNotEqualTo(mUserDTO2);
    }
}
