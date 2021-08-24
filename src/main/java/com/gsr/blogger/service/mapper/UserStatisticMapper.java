package com.gsr.blogger.service.mapper;

import com.gsr.blogger.domain.*;
import com.gsr.blogger.service.dto.UserStatisticDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserStatistic} and its DTO {@link UserStatisticDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UserStatisticMapper extends EntityMapper<UserStatisticDTO, UserStatistic> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserStatisticDTO toDtoId(UserStatistic userStatistic);
}
