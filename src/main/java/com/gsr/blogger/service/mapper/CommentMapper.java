package com.gsr.blogger.service.mapper;

import com.gsr.blogger.domain.*;
import com.gsr.blogger.service.dto.CommentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring", uses = { PostMapper.class, MUserMapper.class })
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "post", source = "post", qualifiedByName = "id")
    @Mapping(target = "muser", source = "muser", qualifiedByName = "id")
    CommentDTO toDto(Comment s);
}
