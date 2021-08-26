package com.gsr.blogger.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gsr.blogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserStatisticTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserStatistic.class);
        UserStatistic userStatistic1 = new UserStatistic();
        userStatistic1.setId(1L);
        UserStatistic userStatistic2 = new UserStatistic();
        userStatistic2.setId(userStatistic1.getId());
        assertThat(userStatistic1).isEqualTo(userStatistic2);
        userStatistic2.setId(2L);
        assertThat(userStatistic1).isNotEqualTo(userStatistic2);
        userStatistic1.setId(null);
        assertThat(userStatistic1).isNotEqualTo(userStatistic2);
    }
}
