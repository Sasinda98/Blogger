package com.gsr.blogger.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.gsr.blogger.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChannelDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChannelDTO.class);
        ChannelDTO channelDTO1 = new ChannelDTO();
        channelDTO1.setId(1L);
        ChannelDTO channelDTO2 = new ChannelDTO();
        assertThat(channelDTO1).isNotEqualTo(channelDTO2);
        channelDTO2.setId(channelDTO1.getId());
        assertThat(channelDTO1).isEqualTo(channelDTO2);
        channelDTO2.setId(2L);
        assertThat(channelDTO1).isNotEqualTo(channelDTO2);
        channelDTO1.setId(null);
        assertThat(channelDTO1).isNotEqualTo(channelDTO2);
    }
}
