package com.gsr.blogger.service.mapper;

import com.gsr.blogger.domain.*;
import com.gsr.blogger.service.dto.PostDTO;
import java.util.List;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Post} and its DTO {@link PostDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PostMapper extends EntityMapper<PostDTO, Post> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PostDTO toDtoId(Post post);

    @Override
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "removeComment", ignore = true)
    Post toEntity(PostDTO dto);

    @Override
    default void partialUpdate(Post entity, PostDTO dto) {
        if (dto == null) {
            return;
        }

        if (dto.getId() != null) {
            entity.id(dto.getId());
        }
        if (dto.getTitle() != null) {
            entity.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            entity.setContent(dto.getContent());
        }
        if (dto.getLikes() != null) {
            entity.setLikes(dto.getLikes());
        }
        if (dto.getCreatedAt() != null) {
            entity.setCreatedAt(dto.getCreatedAt());
        }
        if (dto.getModifiedAt() != null) {
            entity.setModifiedAt(dto.getModifiedAt());
        }
        if (dto.getIsDeleted() != null) {
            entity.setIsDeleted(dto.getIsDeleted());
        }
    }
}
