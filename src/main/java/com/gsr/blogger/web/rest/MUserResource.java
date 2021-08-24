package com.gsr.blogger.web.rest;

import com.gsr.blogger.repository.MUserRepository;
import com.gsr.blogger.service.MUserService;
import com.gsr.blogger.service.dto.MUserDTO;
import com.gsr.blogger.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gsr.blogger.domain.MUser}.
 */
@RestController
@RequestMapping("/api")
public class MUserResource {

    private final Logger log = LoggerFactory.getLogger(MUserResource.class);

    private static final String ENTITY_NAME = "mUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MUserService mUserService;

    private final MUserRepository mUserRepository;

    public MUserResource(MUserService mUserService, MUserRepository mUserRepository) {
        this.mUserService = mUserService;
        this.mUserRepository = mUserRepository;
    }

    /**
     * {@code POST  /m-users} : Create a new mUser.
     *
     * @param mUserDTO the mUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mUserDTO, or with status {@code 400 (Bad Request)} if the mUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/m-users")
    public ResponseEntity<MUserDTO> createMUser(@RequestBody MUserDTO mUserDTO) throws URISyntaxException {
        log.debug("REST request to save MUser : {}", mUserDTO);
        if (mUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new mUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MUserDTO result = mUserService.save(mUserDTO);
        return ResponseEntity
            .created(new URI("/api/m-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /m-users/:id} : Updates an existing mUser.
     *
     * @param id the id of the mUserDTO to save.
     * @param mUserDTO the mUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mUserDTO,
     * or with status {@code 400 (Bad Request)} if the mUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/m-users/{id}")
    public ResponseEntity<MUserDTO> updateMUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MUserDTO mUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to update MUser : {}, {}", id, mUserDTO);
        if (mUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MUserDTO result = mUserService.save(mUserDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mUserDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /m-users/:id} : Partial updates given fields of an existing mUser, field will ignore if it is null
     *
     * @param id the id of the mUserDTO to save.
     * @param mUserDTO the mUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mUserDTO,
     * or with status {@code 400 (Bad Request)} if the mUserDTO is not valid,
     * or with status {@code 404 (Not Found)} if the mUserDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the mUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/m-users/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<MUserDTO> partialUpdateMUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MUserDTO mUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update MUser partially : {}, {}", id, mUserDTO);
        if (mUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MUserDTO> result = mUserService.partialUpdate(mUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mUserDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /m-users} : get all the mUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mUsers in body.
     */
    @GetMapping("/m-users")
    public List<MUserDTO> getAllMUsers() {
        log.debug("REST request to get all MUsers");
        return mUserService.findAll();
    }

    /**
     * {@code GET  /m-users/:id} : get the "id" mUser.
     *
     * @param id the id of the mUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/m-users/{id}")
    public ResponseEntity<MUserDTO> getMUser(@PathVariable Long id) {
        log.debug("REST request to get MUser : {}", id);
        Optional<MUserDTO> mUserDTO = mUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mUserDTO);
    }

    /**
     * {@code DELETE  /m-users/:id} : delete the "id" mUser.
     *
     * @param id the id of the mUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/m-users/{id}")
    public ResponseEntity<Void> deleteMUser(@PathVariable Long id) {
        log.debug("REST request to delete MUser : {}", id);
        mUserService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
