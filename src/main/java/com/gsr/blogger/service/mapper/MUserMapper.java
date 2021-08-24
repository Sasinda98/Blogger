package com.gsr.blogger.service.mapper;

import com.gsr.blogger.domain.*;
import com.gsr.blogger.service.dto.MUserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link MUser} and its DTO {@link MUserDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserStatisticMapper.class })
public interface MUserMapper extends EntityMapper<MUserDTO, MUser> {
    @Mapping(target = "userStatistic", source = "userStatistic", qualifiedByName = "id")
    MUserDTO toDto(MUser s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MUserDTO toDtoId(MUser mUser);
}
