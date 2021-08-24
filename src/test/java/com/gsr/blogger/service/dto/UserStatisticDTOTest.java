package com.gsr.blogger.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.gsr.blogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserStatisticDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserStatisticDTO.class);
        UserStatisticDTO userStatisticDTO1 = new UserStatisticDTO();
        userStatisticDTO1.setId(1L);
        UserStatisticDTO userStatisticDTO2 = new UserStatisticDTO();
        assertThat(userStatisticDTO1).isNotEqualTo(userStatisticDTO2);
        userStatisticDTO2.setId(userStatisticDTO1.getId());
        assertThat(userStatisticDTO1).isEqualTo(userStatisticDTO2);
        userStatisticDTO2.setId(2L);
        assertThat(userStatisticDTO1).isNotEqualTo(userStatisticDTO2);
        userStatisticDTO1.setId(null);
        assertThat(userStatisticDTO1).isNotEqualTo(userStatisticDTO2);
    }
}
