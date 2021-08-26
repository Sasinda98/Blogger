package com.gsr.blogger.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserStatisticMapperTest {

    private UserStatisticMapper userStatisticMapper;

    @BeforeEach
    public void setUp() {
        userStatisticMapper = new UserStatisticMapperImpl();
    }
}
