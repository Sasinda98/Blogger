package com.gsr.blogger.service.mapper;

import com.gsr.blogger.domain.*;
import com.gsr.blogger.service.dto.ChannelDTO;
import java.util.Set;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Channel} and its DTO {@link ChannelDTO}.
 */
@Mapper(componentModel = "spring", uses = { PostMapper.class, MUserMapper.class })
public interface ChannelMapper extends EntityMapper<ChannelDTO, Channel> {
    @Mapping(target = "posts", source = "posts", qualifiedByName = "idSet")
    @Mapping(target = "muser", source = "muser", qualifiedByName = "id")
    ChannelDTO toDto(Channel s);

    @Mapping(target = "removePost", ignore = true)
    Channel toEntity(ChannelDTO channelDTO);
}
