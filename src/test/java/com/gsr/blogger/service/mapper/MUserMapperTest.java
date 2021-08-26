package com.gsr.blogger.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MUserMapperTest {

    private MUserMapper mUserMapper;

    @BeforeEach
    public void setUp() {
        mUserMapper = new MUserMapperImpl();
    }
}
