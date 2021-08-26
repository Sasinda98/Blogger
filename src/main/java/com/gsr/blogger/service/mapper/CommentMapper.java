package com.gsr.blogger.service.mapper;

import com.gsr.blogger.domain.*;
import com.gsr.blogger.service.dto.CommentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring", uses = { PostMapper.class, MUserMapper.class })
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "linkedPost", source = "linkedPost", qualifiedByName = "id")
    @Mapping(target = "commentCreator", source = "commentCreator", qualifiedByName = "id")
    CommentDTO toDto(Comment s);
}
